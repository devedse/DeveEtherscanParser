// ==UserScript==
// @name         DeveEtherscanParser
// @namespace    https://github.com/devedse/DeveEtherscanParser
// @version      0.1
// @description  Tries to parse transaction data using provided ABI's
// @author       Devedse
// @match        *.etherscan.io/*

// @grant        none
// ==/UserScript==

let ethUSDPrice = 0;
/**
 * Helper methods
 */
class Utils {

    /**
   * Formats a durations from seconds to number of days
   * @param durationInSeconds
   * @returns {string}
   */
    static formatDuration(durationInSeconds)
    {
        let duration = (durationInSeconds / (3600 * 24)).toPrecision(1);
        if (duration == parseInt(duration))
        {
            duration = parseInt(duration);
        }
        return duration;
    }
}

/**
 *
 */
class TransactionParser {

    constructor() {
        this.abis = [];
        //Add ABI's for known contracts here
        this.abis.push([{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x095ea7b3"},{"constant":true,"inputs":[],"name":"implementsERC721","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x1051db34"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x18160ddd"},{"constant":false,"inputs":[{"name":"_beneficiary","type":"address"}],"name":"setBeneficiary","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x1c31f710"},{"constant":true,"inputs":[],"name":"isActive","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x22f3e2d4"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x23b872dd"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x27e235e3"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"setMinMargin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x2cc27341"},{"constant":false,"inputs":[{"name":"regionId","type":"uint16"}],"name":"completeRegionAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x2ce2d7c0"},{"constant":true,"inputs":[{"name":"regionId","type":"uint16"}],"name":"getRegionPrice","outputs":[{"name":"next_bid","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x301f2dac"},{"constant":true,"inputs":[{"name":"x","type":"int32"},{"name":"y","type":"int32"}],"name":"getPayouts","outputs":[{"name":"payouts","type":"uint256[49]"},{"name":"addresses","type":"address[49]"},{"name":"tokenBought","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x301fdb54"},{"constant":true,"inputs":[],"name":"divider","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x378efa37"},{"constant":true,"inputs":[],"name":"beneficiary","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x38af3eed"},{"constant":false,"inputs":[{"name":"x","type":"int32"},{"name":"y","type":"int32"}],"name":"buyLand","outputs":[],"payable":true,"stateMutability":"payable","type":"function","signature":"0x38e998a7"},{"constant":true,"inputs":[],"name":"minMargin","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x39c294be"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tokens","outputs":[{"name":"resources","type":"uint8"},{"name":"region","type":"uint16"},{"name":"buyPrice","type":"uint256"},{"name":"owner","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x4f64b2be"},{"constant":false,"inputs":[{"name":"regionId","type":"uint16"}],"name":"makeBid","outputs":[],"payable":true,"stateMutability":"payable","type":"function","signature":"0x51c03b85"},{"constant":false,"inputs":[{"name":"regionId","type":"uint16"}],"name":"setAllowSellLands","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x60bd409e"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"owner","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x6352211e"},{"constant":false,"inputs":[{"name":"regionId","type":"uint16"},{"name":"regionName","type":"string"}],"name":"setRegionName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x6b55264d"},{"constant":false,"inputs":[{"name":"x","type":"int32[]"},{"name":"y","type":"int32[]"},{"name":"region","type":"uint8[]"},{"name":"resources","type":"uint8[]"}],"name":"activateZone","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x6eebb73f"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x70a08231"},{"constant":false,"inputs":[{"name":"_regionId","type":"uint16"},{"name":"_startPrice","type":"uint256"},{"name":"_regionName","type":"string"}],"name":"addRegion","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x792a152d"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"approved","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x7d4061e6"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x835fc6ca"},{"constant":true,"inputs":[{"name":"","type":"int32"},{"name":"","type":"int32"}],"name":"zone","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8d3f1e44"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8da5cb5b"},{"constant":false,"inputs":[{"name":"regionId","type":"uint16"}],"name":"setRegionOnSale","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x969bece3"},{"constant":true,"inputs":[{"name":"","type":"uint16"}],"name":"regions","outputs":[{"name":"owner","type":"address"},{"name":"tax","type":"uint8"},{"name":"startPrice","type":"uint256"},{"name":"regionName","type":"string"},{"name":"onSale","type":"bool"},{"name":"allowSaleLands","type":"bool"},{"name":"created","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x9a877fb3"},{"constant":true,"inputs":[{"name":"","type":"uint16"}],"name":"region_bids","outputs":[{"name":"currentBuyer","type":"address"},{"name":"bid","type":"uint256"},{"name":"activeTill","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x9fe0b367"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa9059cbb"},{"constant":true,"inputs":[{"name":"x","type":"int32"},{"name":"y","type":"int32"}],"name":"getLandPrice","outputs":[{"name":"price","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xab07f054"},{"constant":false,"inputs":[{"name":"_mapMaster","type":"address"}],"name":"setMapMaster","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xb43d9ede"},{"constant":false,"inputs":[{"name":"regionId","type":"uint16"}],"name":"takeRegion","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xb5dcbb69"},{"constant":false,"inputs":[{"name":"regionId","type":"uint16"},{"name":"owner","type":"address"},{"name":"viewPrice","type":"uint256"}],"name":"setRegionOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xb68e8552"},{"constant":true,"inputs":[],"name":"basePrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xc7876ea4"},{"constant":true,"inputs":[],"name":"defaultRegionTax","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xcd9a27ba"},{"constant":true,"inputs":[{"name":"_regionId","type":"uint16"}],"name":"regionExists","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xd5a506d0"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"setBasePrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xde4b3262"},{"constant":false,"inputs":[{"name":"regionId","type":"uint16"},{"name":"tax","type":"uint8"}],"name":"setRegionTax","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xe850efaf"},{"constant":false,"inputs":[{"name":"regionId","type":"uint16"},{"name":"price","type":"uint256"}],"name":"setRegionPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xeb0bfa38"},{"constant":true,"inputs":[],"name":"SaleActive","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf1d2165f"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf2fde38b"},{"constant":false,"inputs":[],"name":"withdrawalAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf44b79b3"},{"constant":true,"inputs":[],"name":"mapMaster","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf4d176e1"},{"constant":false,"inputs":[],"name":"setSaleEnd","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf835a686"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"zone_reverse","outputs":[{"name":"x","type":"int32"},{"name":"y","type":"int32"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xfa5d174d"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"approved","type":"address"},{"indexed":false,"name":"tokenId","type":"uint256"}],"name":"Approval","type":"event","signature":"0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"},{"anonymous":false,"inputs":[{"indexed":false,"name":"regionId","type":"uint16"}],"name":"RegionAllowSaleLands","type":"event","signature":"0xb51fb8bbfa3da24418034519117a50979b837f70e121296bc026ee665ce79b23"},{"anonymous":false,"inputs":[{"indexed":false,"name":"x","type":"int256"},{"indexed":false,"name":"y","type":"int256"},{"indexed":false,"name":"tokenId","type":"uint256"}],"name":"ActivateMap","type":"event","signature":"0x8f32e652c6806b682ac4685b78efed8695949d3dc61a1d22e96fedea32bab1f3"},{"anonymous":false,"inputs":[{"indexed":true,"name":"regionId","type":"uint16"}],"name":"AddRegion","type":"event","signature":"0x399f06325e5cc0f4ee1fb06491dbac3bb10e0b26fe872a831673a1b84e326c35"},{"anonymous":false,"inputs":[{"indexed":true,"name":"regionId","type":"uint16"},{"indexed":false,"name":"price","type":"uint256"}],"name":"UpdateRegionPrice","type":"event","signature":"0x334cd32957a0eb9f4c727ed73fab8a13424e9da07e864bd7beb3f84c7650b3e8"},{"anonymous":false,"inputs":[{"indexed":true,"name":"regionId","type":"uint16"},{"indexed":false,"name":"regionName","type":"string"}],"name":"ChangeRegionName","type":"event","signature":"0xb06f576e825ec000eb0407092b3150b13f3c68cc964d0a5a8405c0b715e714ac"},{"anonymous":false,"inputs":[{"indexed":true,"name":"regionId","type":"uint16"},{"indexed":false,"name":"tax","type":"uint8"}],"name":"TaxUpdate","type":"event","signature":"0xc72bc3ebe54db6ad5d04be20eb76955c1fbdfc05fc89a45d3959eca9f75e77cb"},{"anonymous":false,"inputs":[{"indexed":true,"name":"regionId","type":"uint16"}],"name":"RegionOnSale","type":"event","signature":"0x1f4df03e985a1c2625c2bb5c99d6baabdcf19970943fc02c21110cf810fe48ed"},{"anonymous":false,"inputs":[{"indexed":true,"name":"regionId","type":"uint16"},{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"activeTill","type":"uint256"}],"name":"RegionNewBid","type":"event","signature":"0x29a276aafcd155473a77c82e5c2a4ccc84d83bac0fcd454d1e9ca6dacecf0c1f"},{"anonymous":false,"inputs":[{"indexed":true,"name":"regionId","type":"uint16"}],"name":"AuctionStarts","type":"event","signature":"0xf6e8b71db70830e39e2c98f38b929b65c3521e6479cc5fa19b21567574f2b7a4"},{"anonymous":false,"inputs":[{"indexed":true,"name":"regionId","type":"uint16"},{"indexed":false,"name":"owner","type":"address"}],"name":"RegionSold","type":"event","signature":"0x31829e9d057f1095a6016bb319e553b5fa64419f5ad8b0147aeb1586b1dc3d0e"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Payout","type":"event","signature":"0x5afeca38b2064c23a692c4cf353015d80ab3ecc417b4f893f372690c11fbd9a6"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"RegionPayout","type":"event","signature":"0x7e20eee8794e3a490330b424b5875ba62ffefb32b4ae48090cb82edfc2d2ec89"},{"anonymous":false,"inputs":[{"indexed":false,"name":"isEnded","type":"bool"}],"name":"EndSale","type":"event","signature":"0x75db2c8af3a77c8f79f1e5f6f7606c455d1d3d974acad372b8f4c38d0b541a39"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event","signature":"0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"}]);
    }

    /**
   * Parses a transaction details
   * @param content
   * @returns {Promise}
   */
    parseTransactionDetailsInputData(content)
    {
        var self = this;

        return new Promise((resolve, reject) => {

            let data = {
                methodName: "Couldn't detect method name",
                methodDescription: '',
                args: []
            };

            if (content.startsWith("0x")) {

                for (let abiNumber = 0; abiNumber < self.abis.length; abiNumber++) {
                    let abiForApplication = self.abis[abiNumber];

                    for (let i = 0; i < abiForApplication.length; i++) {
                        let cur = abiForApplication[i];
                        if (content.startsWith(cur.signature)) {
                            data.methodName = cur.name;

                            let remainder = content.substring(cur.signature.length);
                            for (var y = 0; y < cur.inputs.length; y++) {
                                let curInput = cur.inputs[y];
                                let curParsed = remainder.substring(0, 64);

                                let result = parseInt(curParsed, 16);
                                data.args.push({name: curInput.name, value: result, type: curInput.type});

                                remainder = remainder.substring(64);
                            }
                            break;
                        }
                    }
                }
            } else {
                data.methodName = "Already known";
            }

            resolve(data);
        });
    }
}

/**
 *
 */
class HtmlHelper {

    /**
   * Adds data on top of the transaction details page
   * @param data
   */
    displayDataForTransactionDetails(data)
    {
        var stringifiedData = data.methodName + " " + JSON.stringify(data.args);

        let leftColunm = $('<div class="col-sm-3">Parsed Input Data: (DeveEtherscanParser)</div>');
        let rightColumn = $('<div class="col-sm-9 cbs"><span title="The binary data that formed the input to the transaction, either the input data if it was a message call or the contract initialisation if it was a contract creation"><textarea readonly="" spellcheck="false" style="width: 98%; font-size: small; font-family: Monospace; padding: 8px; background-color: #EEEEEE;" rows="4" id="inputdata">' + stringifiedData + '</textarea><br><span id="rawinput" style="display:none"></span></span></div>')

        let foundItem = $('#ContentPlaceHolder1_maintable');
        foundItem.append(leftColunm);
        foundItem.append(rightColumn);
    }
}

class Main {
    /**
   * Continuously checks if we are on a different page, and calls processScriptForNewPage
   * to udpdate the page if we are
   */
    doCheckUrlLoop()
    {
        let fireOnHashChangesToo = true;
        setInterval(
            () =>
            {
                if (this.lastPathStr !== location.pathname
                    || this.lastQueryStr !== location.search
                    || (fireOnHashChangesToo && this.lastHashStr !== location.hash)
                   )
                {
                    this.lastPathStr = location.pathname;
                    this.lastQueryStr = location.search;
                    this.lastHashStr = location.hash;

                    this.processScriptForNewPage();
                }
            }
            , 1000);
    }

    /**
   * Adds more data to the page
   */
    processScriptForNewPage()
    {
        let htmlHelper = new HtmlHelper();

        let transactionParser = new TransactionParser();
        let inputDataElt = $('#inputdata');

        if (inputDataElt.length)
        {
            let transactionId = $('h1 .lead-modify').html().replace("&nbsp;", '');
            if (false && localStorage.getItem(transactionId))
            {
                htmlHelper.displayDataForTransactionDetails(JSON.parse(localStorage.getItem(transactionId)));
            }
            else
            {
                transactionParser.parseTransactionDetailsInputData(inputDataElt.text()).then(data =>
                                                                                             {
                    localStorage.setItem(transactionId, JSON.stringify(data));
                    htmlHelper.displayDataForTransactionDetails(data);
                });
            }

        }
    }
}

/**
 * Entry point
 */
$(document).ready(() =>
                  {
    console.log('DeveEtherscanParser loaded');
    let main = new Main();

    $.getJSON("https://api.coinmarketcap.com/v1/ticker/ethereum/", data =>
              {
        ethUSDPrice = parseFloat(data[0].price_usd);
        main.doCheckUrlLoop();
    });

})
;
