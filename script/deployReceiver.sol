// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import { IStargate } from "../src/interfaces/IStargate.sol";
import "../src/Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StargateTransferScript is Script {
    

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);


        address  endpoint =0x6EDCE65403992e310A62460808c4b910D972f10f;
        address  stargate =0x0d7aB83370b492f2AB096c80111381674456e8d8;

        // Deploy the StargateTransfer contract
        Receiver receiver = new Receiver(endpoint,stargate);

        vm.stopBroadcast();
    }
}