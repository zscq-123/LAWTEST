package com.lawtest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/** 参与者登记请求（学号去重） */
@Data
public class ParticipantRegisterRequest {

    @NotBlank(message = "请输入姓名")
    @Size(max = 64, message = "姓名过长")
    private String name;

    @NotBlank(message = "请输入学号")
    @Size(max = 32, message = "学号过长")
    private String studentNo;

    /** 登记入口：screen-大屏 / mobile-手机（缺省 mobile） */
    private String source;
}
