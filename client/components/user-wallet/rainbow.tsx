import {
    AuthenticationStatus,
    ConnectButton,
    RainbowKitAuthenticationProvider,
    RainbowKitProvider,
    createAuthenticationAdapter,
    getDefaultWallets,
    lightTheme,
} from "@rainbow-me/rainbowkit";
import { ConnectButtonRendererProps } from "@rainbow-me/rainbowkit/dist/components/ConnectButton/ConnectButtonRenderer";
import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";
import { SiweMessage, generateNonce } from "siwe";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { arbitrum, mainnet, optimism, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { $verifyUserWallet } from "../../../server";
import { pushRoute } from "../../services/router";

const appName = "FreeBe App";

const { chains, provider } = configureChains(
    [mainnet, polygon, optimism, arbitrum],
    [
        // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
        publicProvider(),
    ]
);

const { connectors } = getDefaultWallets({
    appName,
    chains,
});

const client = createClient({
    autoConnect: true,
    connectors,
    provider,
});

function Rainbow(props: {
    label?: string;
    children?: ConnectButtonRendererProps["children"];
}) {
    const { label, children } = props;

    const authAdapter = createAuthenticationAdapter({
        getNonce: async () => {
            return generateNonce();
        },

        createMessage: (params) => {
            return new SiweMessage({
                ...params,
                statement: appName,
                domain: location.host,
                uri: location.origin + location.pathname,
                version: "1",
            });
        },

        getMessageBody: (params) => {
            return params.message.prepareMessage();
        },

        verify: async (params) => {
            try {
                setAuthStatus("loading");
                const auth = await $verifyUserWallet(params);
                if (auth) {
                    sessionStorage.setItem("auth", JSON.stringify(auth));
                    setAuthStatus("authenticated");
                    pushRoute(location.pathname + location.search, true);

                    return true;
                }
            } catch (e) {}

            setAuthStatus("unauthenticated");
            return false;
        },

        signOut: async () => {
            sessionStorage.removeItem("auth");
            setAuthStatus("unauthenticated");
            pushRoute(location.pathname + location.search, true);
        },
    });

    const [authStatus, setAuthStatus] = useState<AuthenticationStatus>(
        sessionStorage.auth ? "authenticated" : "unauthenticated"
    );

    return (
        <WagmiConfig client={client}>
            <RainbowKitAuthenticationProvider
                adapter={authAdapter}
                status={authStatus}
            >
                <RainbowKitProvider
                    chains={chains}
                    theme={lightTheme()}
                    modalSize="compact"
                >
                    {children && (
                        <ConnectButton.Custom>{children}</ConnectButton.Custom>
                    )}

                    {!children && (
                        <ConnectButton
                            label={label}
                            chainStatus="none"
                            showBalance={false}
                        />
                    )}
                </RainbowKitProvider>
            </RainbowKitAuthenticationProvider>
        </WagmiConfig>
    );
}

export { Rainbow };
