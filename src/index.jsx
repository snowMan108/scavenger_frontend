import React from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { MetaMaskProvider } from './hooks/useMetaMask'
import { Web3Provider } from '@ethersproject/providers'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/38595/scavengerwtf/0.1.2',
  cache: new InMemoryCache(),
})

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}
import './assets/styles.css'
import App from './app'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <MetaMaskProvider>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </MetaMaskProvider>
    </Web3ReactProvider>
  </React.StrictMode>
)
