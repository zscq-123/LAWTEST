package com.lawtest;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * “五彩法途，筑梦未来”线上职业特质测评系统 后端启动类
 */
@SpringBootApplication
@MapperScan("com.lawtest.mapper")
public class LawtestApplication {

    public static void main(String[] args) {
        SpringApplication.run(LawtestApplication.class, args);
    }
}
