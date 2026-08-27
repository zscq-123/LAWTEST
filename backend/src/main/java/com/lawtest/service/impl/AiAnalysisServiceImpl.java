package com.lawtest.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.lawtest.common.BusinessException;
import com.lawtest.dto.AiAnalysisVO;
import com.lawtest.service.AiAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

/**
 * 小米 MiMo 大模型深度分析服务
 * <p>
 * 调用 OpenAI 兼容接口 https://api.xiaomimimo.com/v1/chat/completions，
 * 使用 mimo-v2.5-pro 模型，把勾选特质词与匹配职业打包给模型，
 * 生成结构化的职业解读（JSON 输出，由后端解析成 AiAnalysisVO）。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiAnalysisServiceImpl implements AiAnalysisService {

    private final ObjectMapper objectMapper;

    @Value("${app.ai.base-url:https://api.xiaomimimo.com/v1}")
    private String aiBaseUrl;

    @Value("${app.ai.api-key:}")
    private String aiApiKey;

    @Value("${app.ai.model:mimo-v2.5-pro}")
    private String aiModel;

    @Value("${app.ai.timeout-seconds:60}")
    private long aiTimeoutSeconds;

    private static final String DISCLAIMER = "以上内容由 AI 大模型基于你的选择生成，仅供参考，不构成职业决策建议。";

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    @Override
    public AiAnalysisVO analyze(List<Long> keywordIds, Long careerId,
                                String keywordWords, String careerName, String careerColorName) {
        if (aiApiKey == null || aiApiKey.isBlank()) {
            throw new BusinessException(503, "AI 服务未配置，请先在后台配置大模型 API Key");
        }

        String prompt = buildPrompt(keywordWords, careerName, careerColorName);
        String reply = callModel(prompt);
        return parseReply(reply);
    }

    /** 构建系统提示词：要求模型按固定 JSON 结构返回 */
    private String buildPrompt(String keywordWords, String careerName, String careerColorName) {
        return """
                你是一名专业的法学院职业规划与体育健康顾问。以下是某位法学院新生在职业特质测评中：
                - 勾选的特质词：%s
                - 系统匹配出的第一适配职业：%s（%s）

                请为这位新生生成一份个性化的职业画像深度解读与大学四年体育锻炼计划。
                要求：语言温暖、专业、真诚，符合大学新生视角；不要堆砌套话；结合具体特质词分析。
                特别注意：plans 字段必须是「大学四年体育锻炼计划」，聚焦体育与身体锻炼，给出具体、可执行的
                运动指导（含运动项目、每周频次、每次时长与强度），并紧扣该职业的身体素质要求
                （例如：律师需长期伏案与出差→加强肩颈腰背与心肺耐力；法官需久坐久站开庭→改善体态与下肢耐力；
                检察官需外勤取证→提升心肺、力量与灵敏度；企业法务需商务久坐→注重肩颈保护与精力管理；
                AI伦理顾问需长期电脑办公→护眼与颈椎防护）。
                按四个阶段分别给出，每阶段一条、简洁有力（40-60字左右）：
                大一·体能筑基 → 大二·专项强化 → 大三·职业场景模拟 → 大四·达标冲刺。
                严格按照以下 JSON 结构返回（strengths/improvements/plans 必须是字符串数组，不要用字符串或逗号串；
                plans 必须恰好 4 条，分别对应上述四个阶段；只输出 JSON 对象本身，不要输出 JSON 以外的任何内容，
                不要用 markdown 代码块）：
                {
                  "summary": "2-3句话的职业契合度解读",
                  "strengths": ["3-5条核心优势"],
                  "improvements": ["3-5条潜在短板与提升建议"],
                  "plans": ["大一·体能筑基：……", "大二·专项强化：……", "大三·职业场景模拟：……", "大四·达标冲刺：……"],
                  "motto": "一句话职业格言或寄语"
                }
                """.formatted(keywordWords, careerName, careerColorName);
    }

    /** 调用 MiMo 对话接口 */
    private String callModel(String prompt) {
        try {
            ObjectNode payload = objectMapper.createObjectNode();
            payload.put("model", aiModel);
            payload.put("temperature", 0.7);
            payload.put("max_tokens", 4000);
            // 关闭思维链，确保 content 直接返回最终答案（JSON）
            payload.put("enable_thinking", false);
            ArrayNode messages = payload.putArray("messages");
            ObjectNode sys = messages.addObject();
            sys.put("role", "system");
            sys.put("content", "你是法学院职业规划专家助手，回复必须严格遵循用户要求的 JSON 格式。");
            ObjectNode user = messages.addObject();
            user.put("role", "user");
            user.put("content", prompt);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(aiBaseUrl + "/chat/completions"))
                    .timeout(Duration.ofSeconds(aiTimeoutSeconds))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + aiApiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                log.error("MiMo API 返回异常 status={} body={}", response.statusCode(), response.body());
                throw new BusinessException(502, "AI 服务暂时不可用，请稍后重试");
            }
            JsonNode root = objectMapper.readTree(response.body());
            JsonNode choice = root.path("choices").path(0).path("message");
            String content = choice.path("content").asText("");
            String reasoning = choice.path("reasoning_content").asText("");
            // 优先取 content；若 content 为空或明显是推理文本（非 { 开头），回退到 reasoning_content
            String reply = content;
            if (reply.isBlank() || (!reply.trim().startsWith("{") && !reasoning.isBlank())) {
                reply = reasoning;
            }
            if (reply.isBlank()) {
                throw new BusinessException(502, "AI 未返回有效内容，请稍后重试");
            }
            return reply;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("调用 MiMo API 失败", e);
            throw new BusinessException(502, "AI 服务调用失败，请稍后重试");
        }
    }

    /** 解析模型返回的 JSON（兼容代码块包裹、纯 JSON、推理文本夹带 JSON 三种形式） */
    private AiAnalysisVO parseReply(String reply) {
        String json = reply.trim();
        // 去掉可能的 ```json ``` 代码块包裹
        if (json.startsWith("```")) {
            json = json.replaceFirst("^```(?:json)?\\s*", "").replaceFirst("\\s*```$", "");
        }
        // 截取第一个 { 到最后一个 }
        int start = json.indexOf('{');
        int end = json.lastIndexOf('}');
        if (start >= 0 && end > start) {
            json = json.substring(start, end + 1);
        }

        AiAnalysisVO vo = new AiAnalysisVO();
        vo.setDisclaimer(DISCLAIMER);
        JsonNode node = tryParse(json);
        if (node == null) {
            log.warn("AI 返回解析失败，原文: {}", reply);
            // 解析失败时降级为纯文本 summary，避免前端空态
            vo.setSummary(reply.length() > 300 ? reply.substring(0, 300) + "…" : reply);
            vo.setStrengths(List.of());
            vo.setImprovements(List.of());
            vo.setPlans(List.of());
            vo.setMotto("");
            return vo;
        }
        vo.setSummary(text(node, "summary"));
        vo.setStrengths(list(node, "strengths"));
        vo.setImprovements(list(node, "improvements"));
        vo.setPlans(list(node, "plans"));
        vo.setMotto(text(node, "motto"));
        return vo;
    }

    /** 尝试解析 JSON；失败时尝试修复截断（补全未闭合的数组/对象引号） */
    private JsonNode tryParse(String json) {
        try {
            return objectMapper.readTree(json);
        } catch (JsonProcessingException ignored) {
            // 截断修复：从后向前找最后一个未闭合的引号，补全为合法 JSON
            String fixed = repairTruncatedJson(json);
            if (fixed == null) return null;
            try {
                return objectMapper.readTree(fixed);
            } catch (JsonProcessingException e) {
                return null;
            }
        }
    }

    /** 简单修复被截断的 JSON：补齐缺失的 ] } 与末尾引号 */
    private String repairTruncatedJson(String json) {
        StringBuilder sb = new StringBuilder(json.trim());
        int quotes = 0;
        // 去掉末尾可能存在的半个引号/逗号
        while (sb.length() > 0 && ",:".indexOf(sb.charAt(sb.length() - 1)) >= 0) {
            sb.setLength(sb.length() - 1);
        }
        // 从后往前统计未闭合的引号
        for (int i = sb.length() - 1; i >= 0; i--) {
            char c = sb.charAt(i);
            if (c == '"' && (i == 0 || sb.charAt(i - 1) != '\\')) {
                quotes++;
            } else if (quotes % 2 == 1) {
                break;
            }
        }
        if (quotes % 2 == 1) {
            sb.append('"');
        }
        // 补全未闭合的数组/对象括号
        java.util.ArrayDeque<Character> stack = new java.util.ArrayDeque<>();
        for (int i = 0; i < sb.length(); i++) {
            char c = sb.charAt(i);
            if (c == '"') {
                // 跳过字符串内容
                i++;
                while (i < sb.length() && (sb.charAt(i) != '"' || sb.charAt(i - 1) == '\\')) i++;
                continue;
            }
            if (c == '[' || c == '{') stack.push(c);
            else if (c == ']' || c == '}') stack.pop();
        }
        while (!stack.isEmpty()) {
            char open = stack.pop();
            sb.append(open == '[' ? ']' : '}');
        }
        return sb.toString();
    }

    private String text(JsonNode node, String field) {
        JsonNode v = node.path(field);
        return v.isMissingNode() || v.isNull() ? "" : v.asText();
    }

    private List<String> list(JsonNode node, String field) {
        List<String> result = new ArrayList<>();
        JsonNode arr = node.path(field);
        if (arr.isArray()) {
            for (JsonNode item : arr) {
                if (item.isTextual() && !item.asText().isBlank()) {
                    result.add(item.asText().trim());
                }
            }
        } else if (arr.isTextual()) {
            // 兼容模型把数组写成字符串的情况：按逗号/分号/换行拆分
            String[] parts = arr.asText().split("[，,；;\\n]");
            for (String p : parts) {
                String t = p.trim().replaceAll("^[\\d、\\.\\-\\s]+", "");
                if (!t.isEmpty()) {
                    result.add(t);
                }
            }
        }
        return result;
    }
}
