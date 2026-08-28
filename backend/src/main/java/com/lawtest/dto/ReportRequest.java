package com.lawtest.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

/** 报告生成请求 */
@Data
public class ReportRequest {

    @NotEmpty(message = "请至少选择一个特质词")
    @Size(max = 50, message = "选词数量超出上限")
    private List<Long> keywordIds;

    /** 参与者学号（可选；传入且已登记时关联身份并标记完成，用于人数去重） */
    private String studentNo;
}
