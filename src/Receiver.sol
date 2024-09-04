// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ILayerZeroComposer} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroComposer.sol";
import {OFTComposeMsgCodec} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/libs/OFTComposeMsgCodec.sol";
import "./aave/IPool.sol";
import "./aave/IPoolAddressesProvider.sol";

contract Receiver is ILayerZeroComposer {
    address public immutable endpoint; //0x6EDCE65403992e310A62460808c4b910D972f10f
    address public immutable stargate; //0x0d7aB83370b492f2AB096c80111381674456e8d8

    // aave
    IPoolAddressesProvider public addressesProvider;
    IPool public lendingPool;

    event ReceivedOnDestination(address token, uint256 amountLD);
    event depositEvent(uint256);

    constructor(
        address _endpoint,
        address _stargate,
        address _addressesProvider
    ) {
        endpoint = _endpoint;
        stargate = _stargate;

        // aave
        addressesProvider = IPoolAddressesProvider(_addressesProvider);
        lendingPool = IPool(addressesProvider.getPool());
    }

    function _depositToAave(
        address _asset,
        uint256 _amount,
        address _onBehalfOf
    ) internal {
        IERC20(_asset).approve(address(lendingPool), _amount);
        lendingPool.deposit(_asset, _amount, _onBehalfOf, 0);
    }

    function getATokenAddress(address _asset) public view returns (address) {
        IPool.ReserveData memory reserveData = lendingPool.getReserveData(
            _asset
        );
        return reserveData.aTokenAddress;
    }

    function lzCompose(
        address _from,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _extraData
    ) external payable {
        require(_from == stargate, "!stargate");
        require(msg.sender == endpoint, "!endpoint");

        uint256 amountLD = OFTComposeMsgCodec.amountLD(_message);
        bytes memory _composeMessage = OFTComposeMsgCodec.composeMsg(_message);

        (address _tokenReceiver, address _oftOnDestination) = abi.decode(
            _composeMessage,
            (address, address)
        );

        // call internal function to deposit
        _depositToAave(_oftOnDestination, amountLD, _tokenReceiver);
        // IERC20(_oftOnDestination).transfer(_tokenReceiver, amountLD);
        emit ReceivedOnDestination(_oftOnDestination, amountLD);
    }

    fallback() external payable {}

    receive() external payable {}
}
