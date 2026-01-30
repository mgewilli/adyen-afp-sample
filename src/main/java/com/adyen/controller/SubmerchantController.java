package com.adyen.controller;

import com.adyen.service.LegalEntityManagementAPIService;

public class SubmerchantController {

    private final LegalEntityManagementAPIService lemApiService;

    public SubmerchantController(LegalEntityManagementAPIService lemApiService) {
        this.lemApiService = lemApiService;
    }


}
