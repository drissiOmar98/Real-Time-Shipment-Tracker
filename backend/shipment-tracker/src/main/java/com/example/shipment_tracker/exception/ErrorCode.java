package com.example.shipment_tracker.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    TRACKING_NUMBER_ALREADY_EXISTS(
            "ERR_TRACKING_NUMBER_EXISTS",
            "A shipment with this tracking number already exists",
            HttpStatus.CONFLICT
    ),

    INTERNAL_EXCEPTION(
            "INTERNAL_EXCEPTION",
            "An internal exception occurred, please try again or contact the admin",
            HttpStatus.INTERNAL_SERVER_ERROR
    );

    private final String code;
    private final String defaultMessage;
    private final HttpStatus status;

    ErrorCode(final String code,
              final String defaultMessage,
              final HttpStatus status) {
        this.code = code;
        this.defaultMessage = defaultMessage;
        this.status = status;
    }
}