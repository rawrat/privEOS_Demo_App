include config.conf
-include config-local.conf

FILE := $(shell openssl rand 16 -hex)
build:
	eosiocpp -o $(CPP_IN).wasm $(CPP_IN).cpp

abi:
	eosiocpp -g $(CPP_IN).abi $(CPP_IN).cpp

deploy: build
	$(CLEOS) set contract $(CONTRACT_ACCOUNT) ../$(CPP_IN)

system:
	$(CLEOS) create account eosio eosio.token $(PK) $(PK)
	$(CLEOS) create account eosio eosio.msig $(PK) $(PK)
	$(CLEOS) create account eosio eosio.bpay $(PK) $(PK)
	$(CLEOS) create account eosio eosio.names $(PK) $(PK)
	$(CLEOS) create account eosio eosio.ram $(PK) $(PK)
	$(CLEOS) create account eosio eosio.ramfee $(PK) $(PK)
	$(CLEOS) create account eosio eosio.saving $(PK) $(PK)
	$(CLEOS) create account eosio eosio.stake $(PK) $(PK)
	$(CLEOS) create account eosio eosio.vpay $(PK) $(PK)
	$(CLEOS) set contract eosio.token $(EOS_CONTRACTS_DIR)/eosio.token -p eosio.token
	$(CLEOS) set contract eosio.msig $(EOS_CONTRACTS_DIR)/eosio.msig -p eosio.msig
	$(CLEOS) push action eosio.token create '["eosio", "10000000000.0000 EOS",0,0,0]' -p eosio.token
	$(CLEOS) push action eosio.token issue '["eosio","1000000000.0000 EOS", "issue"]' -p eosio
	$(CLEOS) set contract eosio $(EOS_CONTRACTS_DIR)/eosio.system -p eosio

setup:
	$(CLEOS) system newaccount --stake-net "1.0000 EOS" --stake-cpu "1.0000 EOS" --buy-ram-kbytes 8000 eosio $(CONTRACT_ACCOUNT) $(PK) $(PK)
	$(CLEOS) system newaccount --stake-net "1.0000 EOS" --stake-cpu "1.0000 EOS" --buy-ram-kbytes 8000 eosio $(BUYER) $(PK) $(PK)
	$(CLEOS) system newaccount --stake-net "1.0000 EOS" --stake-cpu "1.0000 EOS" --buy-ram-kbytes 8000 eosio $(SELLER) $(PK) $(PK)

	$(CLEOS) transfer eosio $(BUYER) "1000.0000 EOS"

	$(CLEOS) set account permission $(CONTRACT_ACCOUNT) active '{"threshold": 1,"keys": [{"key": "$(PK)","weight": 1}],"accounts": [{"permission":{"actor":"$(CONTRACT_ACCOUNT)","permission":"eosio.code"},"weight":1}]}' owner -p $(CONTRACT_ACCOUNT)

clean:
	rm -f $(CPP_IN).wast $(CPP_IN).wasm $(CPP_IN).abi 

<<<<<<< HEAD
prepare:
	$(CLEOS) push action $(CONTRACT_ACCOUNT) prepare '["angelo"]' -p angelo

=======
>>>>>>> contract is now more or less feature-complete
test:
	$(CLEOS) push action $(CONTRACT_ACCOUNT) upload '["$(SELLER)", "$(FILE)", "My first file changed Angelo 2", "This is great", "https://localhost/myfirstvideo/", "1.0000 EOS" ]' -p $(SELLER)
	$(CLEOS) push action $(CONTRACT_ACCOUNT) prepare '["$(BUYER)"]' -p $(BUYER)
	$(CLEOS) transfer $(BUYER) $(CONTRACT_ACCOUNT) "1.0000 EOS" ""
	$(CLEOS) push action $(CONTRACT_ACCOUNT) purchase '["$(BUYER)", "$(FILE)"]' -p $(BUYER)
	$(CLEOS) push action priveosrules store '["$(SELLER)", "$(CONTRACT_ACCOUNT)", "$(FILE)", "XXX"]' -p $(SELLER)
	
	$(CLEOS) push action priveosrules accessgrant '["$(BUYER)", "$(CONTRACT_ACCOUNT)", "$(FILE)"]' -p $(BUYER)

	
show:
	$(CLEOS) get table $(CONTRACT_ACCOUNT) $(CONTRACT_ACCOUNT) files
	
showbalances:
	$(CLEOS) get table $(CONTRACT_ACCOUNT) $(BUYER) balances
	$(CLEOS) get table $(CONTRACT_ACCOUNT) $(SELLER) balances
	