include config.conf
-include config-local.conf

FILE := alice-$(shell openssl rand 16 -hex)
build:
	eosiocpp -o $(CPP_IN).wasm $(CPP_IN).cpp

abi:
	eosiocpp -g $(CPP_IN).abi $(CPP_IN).cpp

deploy: build
	$(CLEOS) set contract $(CONTRACT_ACCOUNT) ../$(CPP_IN)

clean:
	rm -f $(CPP_IN).wast $(CPP_IN).wasm $(CPP_IN).abi

init:
	make setup
	make abi
	make deploy

setup:
	$(CLEOS) system newaccount --stake-net "1.0000 EOS" --stake-cpu "1.0000 EOS" --buy-ram-kbytes 8000 eosio $(CONTRACT_ACCOUNT) $(PUBLIC_KEY) $(PUBLIC_KEY)
	$(CLEOS) system newaccount --stake-net "1.0000 EOS" --stake-cpu "1.0000 EOS" --buy-ram-kbytes 8000 eosio $(ALICE) $(ALICE_PUBLIC_KEY) $(ALICE_PUBLIC_KEY)
	$(CLEOS) system newaccount --stake-net "1.0000 EOS" --stake-cpu "1.0000 EOS" --buy-ram-kbytes 8000 eosio $(BOB) $(BOB_PUBLIC_KEY) $(BOB_PUBLIC_KEY)
	$(CLEOS) set account permission $(CONTRACT_ACCOUNT) active '{"threshold": 1,"keys": [{"key": "$(PUBLIC_KEY)","weight": 1}],"accounts": [{"permission":{"actor":"$(CONTRACT_ACCOUNT)","permission":"eosio.code"},"weight":1}]}' owner -p $(CONTRACT_ACCOUNT)
	make fundusers
	
test:
	$(CLEOS) push action $(CONTRACT_ACCOUNT) upload '["$(ALICE)", "$(FILE)", "Alice dancing on the trees", "This is great", "https://cloudflare-ipfs.com/ipfs/QmUZAvNuB6njV3dfBERreGRk7kTqLhTGUG9v5Bo3yNLC4R", "1.0000 EOS" ]' -p $(ALICE)
	$(CLEOS) push action $(CONTRACT_ACCOUNT) prepare '["$(BOB)"]' -p $(BOB)
	$(CLEOS) transfer $(BOB) $(CONTRACT_ACCOUNT) "1.0000 EOS" ""
	$(CLEOS) push action $(CONTRACT_ACCOUNT) purchase '["$(BOB)", "$(FILE)"]' -p $(BOB)
	$(CLEOS) push action priveosrules store '["$(ALICE)", "$(CONTRACT_ACCOUNT)", "$(FILE)", "XXX"]' -p $(ALICE)
	$(CLEOS) push action priveosrules accessgrant '["$(BOB)", "$(CONTRACT_ACCOUNT)", "$(FILE)", "EOS6Zy532Rgkuo1SKjYbPxLKYs8o2sEzLApNu8Ph66ysjstARrnHm"]' -p $(BOB)

show:
	$(CLEOS) get table $(CONTRACT_ACCOUNT) $(CONTRACT_ACCOUNT) files
	
showbalances:
	$(CLEOS) get table $(CONTRACT_ACCOUNT) $(ALICE) balances
	$(CLEOS) get table $(CONTRACT_ACCOUNT) $(BOB) balances

fundusers:
	$(CLEOS) transfer eosio $(ALICE) "10.0000 EOS" ""
	$(CLEOS) transfer eosio $(BOB) "10.0000 EOS" ""
	
showpurchases:
	$(CLEOS) get table $(CONTRACT_ACCOUNT) $(ALICE) perms
	$(CLEOS) get table $(CONTRACT_ACCOUNT) $(BOB) perms
	
