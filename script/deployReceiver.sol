// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import {IStargate} from "../src/interfaces/IStargate.sol";
import "../src/Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StargateTransferScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        address endpoint = vm.envAddress("OPTIMISM_T_LAYERZERO_ENDPOINT");
        address stargate = vm.envAddress("OPTIMISM_T_STARGATE_ENDPOINT");
        address addressProvider = vm.envAddress("OPTIMISM_T_AAVE_ADDRESS_PROVIDER");

        ChainFolioReceiver receiver = new ChainFolioReceiver(endpoint, stargate, addressProvider);
        console.log("deployed address:", address(receiver));

        vm.stopBroadcast();
    }
}
