// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import {IStargate} from "../src/interfaces/IStargate.sol";
import "../src/stargateTransferWithCompose.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StargateTransferScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        address stargatePoolUSDC = 0x1E8A86EcC9dc41106d3834c6F1033D86939B1e0D;
        uint32 destinationEndpointId = 40231; //arbitrum
        uint256 amount = 1000000; //1 USDC
        address sourceChainPoolToken = 0x488327236B65C61A6c083e8d811a4E0D3d1D4268; //USDC
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the StargateTransfer contract
        stargateTransferWithCompose integration = new stargateTransferWithCompose();

        // as Alice
        IERC20(sourceChainPoolToken).approve(stargatePoolUSDC, amount);

        address _oftOnDestination = 0x3253a335E7bFfB4790Aa4C25C4250d206E9b9773;
        address _tokenReceiver = 0xdb6851c941F9be1Da78Cf1666a1BC5A64f4B4559;

        bytes memory _composeMsg = abi.encode(
            _tokenReceiver,
            _oftOnDestination
        );

        (
            uint256 valueToSend,
            SendParam memory sendParam,
            MessagingFee memory messagingFee
        ) = integration.prepareTakeTaxi(
                stargatePoolUSDC,
                destinationEndpointId,
                amount,
                0xD62372709e1b3Ac4B5b26091EF84e33274d6201E,
                _composeMsg
            );

        IStargate(stargatePoolUSDC).sendToken{value: valueToSend}(
            sendParam,
            messagingFee,
            0xD62372709e1b3Ac4B5b26091EF84e33274d6201E
        );

        vm.stopBroadcast();
    }
}
