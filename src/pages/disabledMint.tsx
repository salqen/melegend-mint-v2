import styled from "@emotion/styled";
import bg from "assets/brand/bg.png";
import logo from "assets/brand/logo.png";
import Button from "components/ui/Button";
import Spinner from "components/ui/Spinner";
import { useWeb3ConnectWindow } from "components/ui/WalletConnectWindow";
import { useGen1Contract } from "hooks/useGen1Contract";
import { useWeb3Remote, useWeb3Wallet } from "hooks/useWeb3";
import { useWeb3TransactionPresenter } from "hooks/useWeb3Transaction";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

const truncate = (input: string, len: number) => (input.length > len ? `${input.substring(0, len)}...` : input);

// Used for wrapping a page component
export const Screen = styled.div<{ image?: string }>`
  background-color: var(--primary);
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Used for providing space between components
export const SpacerXSmall = styled.div`
  height: 8px;
  width: 8px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 16px;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 24px;
  width: 24px;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height: 32px;
  width: 32px;
`;

// Used for providing a wrapper around a component
export const Container = styled.div<{
  flex?: string | number | null;
  fd?: string | number | null;
  jc?: string | number | null;
  ai?: string | number | null;
  test?: string | number | null;
  image?: string | number | null;
}>`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ test }) => (test ? "pink" : "none")};
  width: 100%;
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
`;

export const TextTitle = styled.p`
  color: var(--primary-text);
  font-size: 24px;
  font-weight: 500;
  line-height: 1.2;
`;

export const TextSubTitle = styled.p`
  color: var(--primary-text);
  font-size: 22px;
  line-height: 1.2;
`;

export const TextDescription = styled.p`
  color: var(--primary-text);
  font-size: 20px;
  line-height: 1.2;
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.6;
  }
`;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 140px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

const CONFIG = {
  CONTRACT_ADDRESS: "0x4F8fA22309600850102731E43D3f71150001a68F",
  SCAN_LINK: "https://etherscan.io/token/0x4F8fA22309600850102731E43D3f71150001a68F",
  NETWORK: {
    NAME: "Ethereum",
    SYMBOL: "ETH",
    ID: 1,
  },
  NFT_NAME: "(M)E-Legend",
  SYMBOL: "E-Legend",
  MAX_SUPPLY: 6000,
  WEI_COST: 150000000000000000,
  DISPLAY_COST: 0.1,
  MARKETPLACE: "Opeansea",
  MARKETPLACE_LINK: "https://opensea.io/0x4F8fA22309600850102731E43D3f71150001a68F",
  SHOW_BACKGROUND: true,
};

const disabledMint: NextPage = () => {
  const web3 = useWeb3Remote();
  const wallet = useWeb3Wallet();
  const walletConnect = useWeb3ConnectWindow();
  const contract = useGen1Contract(web3);
  const { presaleMint, publicMint, claimMint } = useWeb3TransactionPresenter();
  const [feedback, setFeedback] = useState(`MINTING IS DISABLED`);
  const [mintAmount, setMintAmount] = useState(1);

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 2) {
      newMintAmount = 2;
    }
    setMintAmount(newMintAmount);
  };

  if (contract.error) {
    throw contract.error;
  }

  if (contract.loading || !contract.connected) {
    return <Spinner />;
  }

  return (
    <div>
      <Head>
        <title>Melegend Mint</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Screen>
        <Container flex={1} ai={"center"} style={{ padding: 24, backgroundColor: "var(--primary)" }} image={bg.src}>
          <StyledLogo alt={"logo"} src={logo.src} />
          <SpacerXSmall />
          <ResponsiveWrapper style={{ padding: 24 }}>
            <Container flex={1} jc={"center"} ai={"center"}>
            </Container>
            <SpacerLarge />
            <Container
              flex={2}
              jc={"center"}
              ai={"center"}
              style={{
                backgroundColor: "var(--accent)",
                padding: 24,
                borderRadius: 24,
                border: "4px dashed var(--secondary)",
                boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
              }}
            >
              <TextTitle
                style={{
                  textAlign: "center",
                  fontSize: 50,
                  fontWeight: "bold",
                  color: "var(--accent-text)",
                }}
              >
                <TextTitle>MELEGEND MINT IS DISABLED!</TextTitle>
              </TextTitle>
              {contract.totalSupply >= contract.maxSupply ? (
                <>
                </>
              ) : (
                <>
                
                </>
              )}
              <SpacerXSmall />
            </Container>
            <SpacerLarge />
            <Container flex={1} jc={"center"} ai={"center"}>
            </Container>
          </ResponsiveWrapper>
          <SpacerLarge />
          <Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
            <TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            ></TextDescription>
            <SpacerXSmall />
            <TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            ></TextDescription>
          </Container>
        </Container>
      </Screen>
    </div>
  );
};

export default disabledMint;
