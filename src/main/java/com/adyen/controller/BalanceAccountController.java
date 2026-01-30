package com.adyen.controller;

import com.adyen.model.balanceplatform.PaginatedPaymentInstrumentsResponse;
import com.adyen.service.ConfigurationAPIService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/balance-accounts")
public class BalanceAccountController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(BalanceAccountController.class);

    @Autowired
    private ConfigurationAPIService configurationAPIService;

    /**
     * Get payment instruments for a balance account
     * @param balanceAccountCode
     * @return
     */
    @GetMapping("/{balanceAccountCode}/payment-instruments")
    ResponseEntity<PaginatedPaymentInstrumentsResponse> getPaymentInstruments(@PathVariable String balanceAccountCode) {

        try {
            var paymentInstruments = getConfigurationAPIService().getPaymentInstruments(balanceAccountCode);
            return new ResponseEntity<>(paymentInstruments, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching payment instruments for balance account: {}", balanceAccountCode, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ConfigurationAPIService getConfigurationAPIService() {
        return configurationAPIService;
    }

    public void setConfigurationAPIService(ConfigurationAPIService configurationAPIService) {
        this.configurationAPIService = configurationAPIService;
    }
}
