package com.adyen.service;

import com.adyen.Client;
import com.adyen.config.ApplicationProperty;
import com.adyen.enums.Environment;
import com.adyen.model.balanceplatform.AccountHolder;
import com.adyen.model.legalentitymanagement.*;
import com.adyen.service.balanceplatform.AccountHoldersApi;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Wraps the Adyen Legal Entity Management API: legalEntities, transferInstruments, hostedOnboarding, etc..
 * It requires the BalancePlatform API key
 *
 * https://docs.adyen.com/api-explorer/legalentity/
 */
@Service
public class AHManagementAPIService {

    private final Logger log = LoggerFactory.getLogger(AHManagementAPIService.class);

    private Client apiClient = null;

    // create client to access the Configuration API
    private Client getApiClient() {
        if (apiClient == null) {
            // create once
            apiClient = new Client(
                    applicationProperty.getBclApiKey(),
                    Environment.TEST); // change to LIVE on prod
        }

        return apiClient;
    }

    @Autowired
    private ApplicationProperty applicationProperty;

    
    public AccountHolder getAH() {
        var ah = "AH32272223226D5K3Q74R4W98";
        try {
            AccountHolder response = getAccountHoldersApi().getAccountHolder(ah);

            log.info(response.toString());
            return response;
        } catch (Exception e) {
            log.error("Error fetching AccountHolder: " + e.getMessage(), e);
            return null;
        }
    }
 
    public ApplicationProperty getApplicationProperty() {
        return applicationProperty;
    }

    public void setApplicationProperty(ApplicationProperty applicationProperty) {
        this.applicationProperty = applicationProperty;
    }

    // LegalEntitiesApi handler
    private AccountHoldersApi getAccountHoldersApi() {
        return new AccountHoldersApi(getApiClient());
    }

}
