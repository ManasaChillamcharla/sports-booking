package com.manasa.sportsbooking.dto.request;

public class UserStatusUpdateRequest {

    private Boolean enabled;

    public UserStatusUpdateRequest() {
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}