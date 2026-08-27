package com.lawtest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 落地二维码（扫码进入手机端测试） */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LandingQrVO {

    /** 二维码内容（手机端测试入口 URL） */
    private String url;
    /** 二维码图片（base64 data URL） */
    private String image;
}
