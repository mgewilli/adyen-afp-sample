package com.adyen.controller;

import com.adyen.model.balanceplatform.AccountHolder;
import com.adyen.model.legalentitymanagement.LegalEntity;
import com.adyen.service.ConfigurationAPIService;
import com.adyen.service.LegalEntityManagementAPIService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
public class AccountHolderController extends BaseController {

    private final Logger log = LoggerFactory.getLogger(AccountHolderController.class);

    @Autowired
    private ConfigurationAPIService configurationAPIService;

    @Autowired
    private LegalEntityManagementAPIService legalEntityManagementAPIService;

    private static final Map<String, Map<String, Object>> accountHoldersCache = new ConcurrentHashMap<>();
    private static final Map<String, Long> pageCacheTimestamps = new ConcurrentHashMap<>();
    private static final long CACHE_DURATION_MS = 5 * 60 * 1000;
    
    private static final List<String> ALL_ACCOUNT_HOLDER_IDS = List.of(
                "AH3296422322B25NPSHM827KG", "AH32CP222322B35NQC8V2FZZJ", "AH3295622322B25NQ7FKP6DBV",
                "AH32CP222322B35NQRX9X5NXB", "AH32CT822322B25NQ2Z6M8TXQ", "AH32CP222322B35NQ7TG5CN57",
                "AH32CP222322B35NQ7TGBCN6S", "AH3295422322B35NQCVMS7XF9", "AH3295422322B35NQCVP67XGH",
                "AH32CQL22322B35NQ7WP88KN6", "AH3295422322B35NQ889S2XZN", "AH3295V22322B35NQ88CC7DBM",
                "AH3295422322B35NQ888P2XXX", "AH3295422322B35NQ8C6K35SV", "AH3295322322B35NQ8C2W6SN2",
                "AH3295V22322B35NQD5JSDZZG", "AH3295V22322B35NQD5KGF232", "AH3295322322B35NQ8DV66XLF",
                "AH3295V22322B35NQD5MGF2KG", "AH3295422322B35NQ8Q5D4822", "AH3295322322B35NQ8PNP7SSV",
                "AH32CP222322B35NQ8P7WDN7Z", "AH3295322322B35NQ8QCC7V7C", "AH3295422322B35NQ8QTL49SZ",
                "AH32CP222322B35NQ8RHJDRCZ", "AH3295V22322B35NQ8SMH8SBX", "AH3295322322B35NQSBKL6L3N",
                "AH3295322322B35NQ8SJG83TS", "AH3295V22322B35NQ8RLR8QV2", "AH32CT822322B25NQ4HTV9TMS",
                "AH32CP222322B25NQ4HZL8Q5K", "AH32CP722322B25NQ4HPM4X37", "AH32CP722322B25NQ4HQM4X45",
                "AH32CP722322B25NQ4HZC4X8C", "AH32CT822322B25NQ4J449TSV", "AH3295422322B35NQ97FT56JG",
                "AH32CP722322B25NPS29HCMSV", "AH32CP722322B25NPS29LCMTL", "AH3295M22322B35NRWF959C3R",
                "AH3296X22322B35NR7PZT2G9T", "AH3296X22322B35NR7PTX2FQD", "AH329BZ22322B35NR7SHF9G7M",
                "AH32CKZ22322B35NR82TX7ZJZ", "AH3296X22322B35NR87VF47TP", "AH3295M22322B35NR87S67LBK",
                "AH329BZ22322B35NR8DD4CGC2", "AH3295322322B35NQWD2ZCDF4", "AH32CP222322B35NQWK5J8LN9",
                "AH32CTR22322B35NQWKVG9779", "AH32CKZ22322B35NR8KJW8XK9", "AH32CND22322B35NQWWW63L8G",
                "AH32CMH22322B35NQWWTW7GDT", "AH32CND22322B35NQWX4D3LGK", "AH32CQL22322B35NQWX3B67SK",
                "AH32CND22322B35NQX4CL3T89", "AH32CQL22322B35NQX4CT6HT9", "AH32CND22322B35NQX4DB3T9S",
                "AH32CQL22322B35NQX7RF6SBD", "AH32CND22322B35NQX7HQ44JT", "AH3295M22322B35NQXC885ZWQ",
                "AH3295M22322B35NQXC5X5ZNM", "AH3295Z22322B35NQXHXZ9RQX", "AH3296X22322B35NQXR54GD77",
                "AH3295M22322B35NS42CJ6BWQ", "AH3296X22322B35NRQKT8G99W", "AH329B822322B35NS78D4CK8N",
                "AH3295M22322B35NS42TS6C98", "AH3295M22322B35NS42M26C57", "AH32CMR22322B35NS5NFZBQNN",
                "AH3295M22322B35NS5NLS9ZKF", "AH3296X22322B35NS47GR35XJ", "AH3296X22322B35NRR2MN23KV",
                "AH329BZ22322B35NRR2QH8PFK", "AH32CKZ22322B35NRBXBLBHP2", "AH3296X22322B35NRBXLG8K28",
                "AH329BZ22322B35NS49D7B3TF", "AH32CL822322B35NRRJ4677PP", "AH329BZ22322B35NS4BCKBB5T",
                "AH3296X22322B35NS4CLH3WT7", "AH32CND22322B35NR3CJ46BVS", "AH32CKZ22322B35NR3CJ855D9",
                "AH3296T22322B35NS78CMCBNL", "AH32CND22322B35NR3LWB6RHV", "AH329BZ22322B35NS4FXWBNDB",
                "AH3295M22322B35NS4GW47ZZP", "AH3296T22322B35NS6N58BGJN", "AH329B822322B35NS6NDGBQFL",
                "AH3295M22322B35NS4NDB8L4Z", "AH3296T22322B35NS6P3HBHMZ", "AH3296T22322B35NS6P4QBHR9",
                "AH3296L22322B35NS6P6ZDVMG", "AH329B822322B35NS6PK5BSCW", "AH32CM722322B35NS6PL9BBH4",
                "AH32CKZ22322B35NRVSJ644QD", "AH32CMR22322B35NRVSHSGBFZ", "AH329BZ22322B35NRVWR8CTHM",
                "AH3295M22322B35NRJQNH3XRM", "AH3296L22322B35NS787XFNQP", "AH329BZ22322B35NRW6SBD7N3",
                "AH3296X22322B35NRW76G5LM2", "AH3296X22322B35NRW76W5LN2", "AH3295M22322B35NRW8NK95CZ",
                "AH3295M22322B35NRW8NN95DQ", "AH3295M22322B35NRW9X4962T", "AH32CMZ22322B55NTBDXMC23Q",
                "AH32CNZ22322B55NTBFRHF3ND", "AH32CNZ22322B55NTBFRKF3P6", "AH3294H22322B55NTBHB33NGM",
                "AH329C722322B35NT2MR463W5", "AH3296L22322B35NT2MQG7VMD", "AH3292W22322B55NT6WC67N7W",
                "AH3298822322B55NT6V552NVX", "AH3292W22322B55NT6VRW7M65", "AH3298822322B55NT6VNT2QTT",
                "AH32CKZ22322B35NSR7J7C65S", "AH32CM722322B35NSR7K87H7N", "AH32CM722322B35NSR7X47HQ2",
                "AH32CKZ22322B35NSR9CCC9RP", "AH329B822322B35NSR8LG38HV", "AH32CM722322B35NSR8LC7L47",
                "AH32CM722322B35NSR8LL7L6L", "AH32CQG22322B35NSR8L865KC", "AH3296T22322B35NSR7R52MJH",
                "AH32CM722322B35NSR7XK7HR2", "AH3296L22322B35NSR7R65843", "AH3296T22322B35NSR9C82TVR",
                "AH329B822322B35NSR8NS392G", "AH329B822322B35NSR9CK3B43", "AH3296T22322B35NSRFMJ3F93",
                "AH3298822322B55NT72X236KD", "AH3296L22322B35NSC5897MQF", "AH32CQG22322B35NSTX2J8ZB7",
                "AH32CQG22322B35NSTWXM8Z96", "AH3298822322B55NT78GN43BK", "AH3298822322B55NT7K2P56PL",
                "AH3298822322B55NT7K2S56QC", "AH3292W22322B55NT7K2Q9XPL", "AH3292W22322B55NT7K2P9XNP",
                "AH3294H22322B55NT7JXSDJZV", "AH3292W22322B55NT7JZB9XFV", "AH3294H22322B55NT7K2RDKCD",
                "AH32CMZ22322B55NT7LPR8TDG", "AH32CMZ22322B55NT7LRB8TJ7", "AH32CQZ22322B55NT7LRB6ZHW",
                "AH32CMZ22322B55NT7LR98THB", "AH3294H22322B55NT7LZNDVLN", "AH3294H22322B55NT7M9CDW89",
                "AH329B822322B35NT5PBRFMSL", "AH329C722322B35NT68CNGHFF", "AH32CQZ22322B55NTB7B392KD",
                "AH32CMZ22322B55NTB7H7BVFD", "AH32CQZ22322B55NT8G8B8FXD", "AH3294H22322B55NTB9GZ3D9S",
                "AH329B822322B35NSPVLZF64P", "AH32CMZ22322B55NTBDDRBZDR"
    );

    @GetMapping("/accountHolders")
    ResponseEntity<Map<String, Object>> getAccountHolders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            int totalElements = ALL_ACCOUNT_HOLDER_IDS.size();
            int totalPages = (int) Math.ceil((double) totalElements / size);
            
            if (page < 0 || (page >= totalPages && totalElements > 0)) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            int fromIndex = page * size;
            int toIndex = Math.min(fromIndex + size, totalElements);
            List<String> pageAccountHolderIds = ALL_ACCOUNT_HOLDER_IDS.subList(fromIndex, toIndex);
            
            String pageKey = page + "_" + size;
            long currentTime = System.currentTimeMillis();
            Long cacheTime = pageCacheTimestamps.get(pageKey);
            
            List<Map<String, Object>> pageContent;
            if (cacheTime != null && (currentTime - cacheTime) < CACHE_DURATION_MS) {
                log.info("Using cached data for page {}", page);
                pageContent = pageAccountHolderIds.stream()
                    .map(accountHoldersCache::get)
                    .filter(data -> data != null)
                    .toList();
            } else {
                log.info("Fetching page {} from Adyen API ({} account holders)", page, pageAccountHolderIds.size());
                pageContent = fetchAccountHoldersPage(pageAccountHolderIds);
                pageCacheTimestamps.put(pageKey, currentTime);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", pageContent);
            response.put("page", page);
            response.put("size", size);
            response.put("totalElements", totalElements);
            response.put("totalPages", totalPages);
            response.put("first", page == 0);
            response.put("last", page >= totalPages - 1);
            
            log.info("Returned page {} of {} (size: {}, total: {})", page, totalPages, pageContent.size(), totalElements);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching account holders", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private List<Map<String, Object>> fetchAccountHoldersPage(List<String> accountHolderIds) {
        List<Map<String, Object>> results = new ArrayList<>();
        
        for (String accountHolderId : accountHolderIds) {
            try {
                var accountHolderOpt = getConfigurationAPIService().getAccountHolder(accountHolderId);
                if (accountHolderOpt.isPresent()) {
                    AccountHolder accountHolder = accountHolderOpt.get();
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", accountHolder.getId());
                    data.put("accountHolderId", accountHolder.getId());
                    data.put("reference", accountHolder.getReference());
                    data.put("description", accountHolder.getDescription());
                    data.put("status", accountHolder.getStatus() != null ? accountHolder.getStatus().getValue() : null);
                    
                    if (accountHolder.getLegalEntityId() != null) {
                        try {
                            LegalEntity legalEntity = getLegalEntityManagementAPIService().get(accountHolder.getLegalEntityId());
                            data.put("legalEntityId", legalEntity.getId());
                            data.put("legalName", legalEntity.getIndividual() != null ? 
                                legalEntity.getIndividual().getName().getFirstName() + " " + legalEntity.getIndividual().getName().getLastName() :
                                legalEntity.getOrganization() != null ? legalEntity.getOrganization().getLegalName() :
                                legalEntity.getSoleProprietorship() != null ? legalEntity.getSoleProprietorship().getName() : null);
                            data.put("type", legalEntity.getType() != null ? legalEntity.getType().getValue() : null);
                            data.put("country", legalEntity.getIndividual() != null && legalEntity.getIndividual().getResidentialAddress() != null ?
                                legalEntity.getIndividual().getResidentialAddress().getCountry() :
                                legalEntity.getOrganization() != null && legalEntity.getOrganization().getRegisteredAddress() != null ?
                                legalEntity.getOrganization().getRegisteredAddress().getCountry() : null);
                        } catch (Exception e) {
                            log.warn("Failed to fetch legal entity {} for account holder {}: {}", 
                                accountHolder.getLegalEntityId(), accountHolderId, e.getMessage());
                        }
                    }
                    
                    accountHoldersCache.put(accountHolderId, data);
                    results.add(data);
                }
            } catch (Exception e) {
                log.warn("Failed to fetch account holder {}: {}", accountHolderId, e.getMessage());
            }
        }
        
        log.info("Fetched and cached {} account holders from Adyen API", results.size());
        return results;
    }

    @GetMapping("/accountHolders/{accountHolderId}")
    ResponseEntity<Map<String, Object>> getAccountHolder(@PathVariable String accountHolderId) {
        try {
            Map<String, Object> cached = accountHoldersCache.get(accountHolderId);
            if (cached != null) {
                log.info("Returning cached account holder: {}", accountHolderId);
                return new ResponseEntity<>(cached, HttpStatus.OK);
            }
            
            log.info("Fetching account holder from Adyen API: {}", accountHolderId);
            List<Map<String, Object>> result = fetchAccountHoldersPage(List.of(accountHolderId));
            
            if (result.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            return new ResponseEntity<>(result.get(0), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching account holder: {}", accountHolderId, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/legalEntities/{legalEntityId}")
    ResponseEntity<LegalEntity> getLegalEntity(@PathVariable String legalEntityId) {
        try {
            var legalEntity = getLegalEntityManagementAPIService().get(legalEntityId);
            return new ResponseEntity<>(legalEntity, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching legal entity: {}", legalEntityId, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ConfigurationAPIService getConfigurationAPIService() {
        return configurationAPIService;
    }

    public void setConfigurationAPIService(ConfigurationAPIService configurationAPIService) {
        this.configurationAPIService = configurationAPIService;
    }

    public LegalEntityManagementAPIService getLegalEntityManagementAPIService() {
        return legalEntityManagementAPIService;
    }

    public void setLegalEntityManagementAPIService(LegalEntityManagementAPIService legalEntityManagementAPIService) {
        this.legalEntityManagementAPIService = legalEntityManagementAPIService;
    }
}
