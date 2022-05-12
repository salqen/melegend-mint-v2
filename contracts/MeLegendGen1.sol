// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

//
//   ,-.          ,-.  ,------.       ,--.                                   ,--.
//  / .',--,--,--.'. \ |  .---',-----.|  |    ,---.  ,---.  ,---. ,--,--,  ,-|  |
// |  | |        | |  ||  `--, '-----'|  |   | .-. :| .-. || .-. :|      \' .-. |
// |  | |  |  |  | |  ||  `---.       |  '--.\   --.' '-' '\   --.|  ||  |\ `-' |
//  \ '.`--`--`--'.' / `------'       `-----' `----'.`-  /  `----'`--''--' `---'
//   `-'          `-'                               `---'
//
// Author: Richard Hutta
// Email: huttarichard@gmail.com
//
contract MeLegendGen1 is ERC721Enumerable, Ownable, PaymentSplitter {
  using Strings for uint256;
  using Counters for Counters.Counter;

  enum State {
    NoSale,
    PreSale,
    PublicSale,
    ClaimSale
  }

  uint256 public immutable maxMintSupply = 6000;
  uint256 public immutable maxClaimSupply = 888;
  uint256 public immutable maxSupply = 6888;

  State public state = State.NoSale;

  bytes32 public presaleRoot;
  uint256 public totalClaimed = 0;

  uint256 public presaleMintLimit = 2;
  uint256 public mintLimit = 3;

  ERC721Enumerable public genesisNFT;

  string public baseURI;

  mapping(address => uint256) public _presaleClaimed;
  mapping(uint256 => address) public _genesisClaimed;

  uint256 public immutable presaleMintPrice = 100000000000000000; //0.1 ETH
  uint256 public immutable publicMintPrice = 120000000000000000; //0.12 ETH

  Counters.Counter private _tokenIds;

  uint256[] private _teamShares = [10, 1, 89];

  address[] private _team = [
    0xBD584cE590B7dcdbB93b11e095d9E1D5880B44d9,
    0x7c95D1209E2f95496C4c9A18aA653FdeD834503F,
    0x9b3397fcD9c19E6104D24Ff1542323Bd80f9109d
  ];

  constructor(address _genesisNFT) ERC721("MELegend NFT gen1", "MLegNFT") PaymentSplitter(_team, _teamShares) {
    genesisNFT = ERC721Enumerable(_genesisNFT);
  }

  function enablePresale(bytes32 _presaleRoot) public onlyOwner {
    state = State.PreSale;
    presaleRoot = _presaleRoot;
  }

  function enablePublic() public onlyOwner {
    state = State.PublicSale;
  }

  function enableClaiming() public onlyOwner {
    state = State.ClaimSale;
  }

  function disable() public onlyOwner {
    state = State.NoSale;
  }

  function setBaseURI(string calldata _tokenBaseURI) external onlyOwner {
    baseURI = _tokenBaseURI;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "nonexistent token");
    string memory base = _baseURI();
    return bytes(base).length > 0 ? string(abi.encodePacked(base, tokenId.toString(), ".json")) : "";
  }

  function presaleMint(uint256 _amount, bytes32[] memory proof) external payable {
    require(state == State.PreSale, "presale not enabled");

    // Amount check
    require(_amount > 0, "zero amount");
    require(_presaleClaimed[_msgSender()] + _amount <= presaleMintLimit, "can't mint such a amount");

    // Max supply check
    require(totalSupply() + _amount <= maxMintSupply, "max supply exceeded");

    // Sender value check
    require(msg.value >= presaleMintPrice * _amount, "value sent is not correct");

    // Merkleproof check
    require(verify(_msgSender(), proof), "not selected for the presale");

    for (uint256 ind = 0; ind < _amount; ind++) {
      _tokenIds.increment();
      _safeMint(_msgSender(), _tokenIds.current());
    }

    _presaleClaimed[_msgSender()] = _presaleClaimed[msg.sender] + _amount;
  }

  function publicMint(uint256 _amount) external payable {
    require(state == State.PublicSale, "public sale not enabled");

    // Amount check
    require(_amount > 0, "zero amount");
    require(_amount <= mintLimit, "can't mint so much tokens");

    // Max supply check
    require(totalSupply() + _amount <= maxMintSupply, "max supply exceeded");

    // Sender value check
    require(msg.value >= publicMintPrice * _amount, "value sent is not correct");

    for (uint256 ind = 0; ind < _amount; ind++) {
      _tokenIds.increment();
      _safeMint(msg.sender, _tokenIds.current());
    }
  }

  function claimMint() external payable {
    require(state == State.ClaimSale, "public sale not enabled");
    require(totalClaimed <= maxClaimSupply, "max claim supply exceeded");

    uint256 balance = genesisNFT.balanceOf(_msgSender());
    uint256 claimed = 0;

    for (uint256 i = 0; i < balance; i++) {
      uint256 tokenId = genesisNFT.tokenOfOwnerByIndex(_msgSender(), i);

      if (_genesisClaimed[tokenId] != address(0)) {
        continue;
      }

      _tokenIds.increment();
      _safeMint(msg.sender, _tokenIds.current());
      _genesisClaimed[tokenId] = _msgSender();
      claimed++;
    }

    totalClaimed = totalClaimed + claimed;
  }

  function _baseURI() internal view override returns (string memory) {
    return baseURI;
  }

  function verify(address account, bytes32[] memory proof) internal view returns (bool) {
    bytes32 leaf = keccak256(abi.encodePacked(account));
    return MerkleProof.verify(proof, presaleRoot, leaf);
  }
}
