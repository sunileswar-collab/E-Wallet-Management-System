package com.examly.springapp.exception;

public class InvalidPhoneException extends RuntimeException {
    public InvalidPhoneException(String msg) { super(msg); }
}
