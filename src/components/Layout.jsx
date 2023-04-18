import Background from '../assets/images/background.svg'
import WalletStatus from '../assets/images/wallet-status.svg'
import ConnectWallet from '../assets/images/connect-wallet.svg'
import Card_background from '../assets/images/Card_background.png'
import Card_background_small from '../assets/images/bg-tribe-small.png'
import TribeBtn from '../assets/images/tribe.svg'
import LeaderBoard from '../assets/images/leader-board.svg'
import Rewards from '../assets/images/rewards.svg'
import Button from './Button'
import { Link, useLocation } from 'react-router-dom'
import useMetaMask from '../hooks/useMetaMask'
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { ERC20 } from '@usedapp/core'
import { ERC20_ABI, GOLD_ADDRESS } from '../constants'

export function Layout(props) {
  const { pathname } = useLocation()
  const { connect, disconnect, account, isActive } = useMetaMask()
  const { library } = useWeb3React()
  const [gold, setGold] = useState()
  useEffect(() => {
    if (account) {
      getGoldBalance(account)
    }
    console.log('account in hook', account)
  }, [account])
  const getGoldBalance = async (account) => {
    const signer = library.getSigner()
    const goldContract = new ethers.Contract(GOLD_ADDRESS, ERC20_ABI, signer)
    const balance = await goldContract.balanceOf(account)
    setGold(
      Number(balance) === 0
        ? '0'
        : ethers.utils.formatUnits(balance.toString(), 9)
    )
  }
  return (
    <div
      className="flex min-h-screen flex-col bg-cover bg-left bg-no-repeat"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="flex w-full items-center justify-center px-14 pt-5 lg:px-40 lg:pt-[70px] 3xl:justify-end">
        <Button
          src={WalletStatus}
          className="flex items-center justify-start pl-[38%] pt-[1%] text-xs font-semibold text-[#6C2804] lg:pl-36 lg:text-2xl"
        >
          <b>Gold: {Number(gold).toFixed(2)}</b>
        </Button>
        <Button
          onClick={isActive ? disconnect : connect}
          src={ConnectWallet}
          className="flex items-center justify-center pl-[14%] pt-[1%] text-xs font-bold text-[#6C2804] lg:pl-16 lg:text-2xl"
        >
          {isActive ? 'Disconnect' : 'Connect Wallet'}
          {isActive && account && (
            <p className="absolute top-28 text-[#FCDB67]">
              {account.slice(0, 6)}...
              {account.slice(account.length - 4, account.length)}
            </p>
          )}   
        </Button>
      </div>
      <div className="mt-6 flex w-full max-w-[940px] flex-grow flex-col justify-center gap-5 self-center pl-[5%] pr-[5%] pb-[70px] 3xl:max-w-none 3xl:pl-[20%]">
        <div className="flex justify-center px-[7%] 3xl:justify-start 3xl:px-0">
          <Link
            to="/"
            className={pathname === '/' ? 'opacity-100' : 'opacity-40'}
          >
            <Button
              className="flex items-center justify-center text-[40px] font-normal text-[#FCDB67]"
              src={TribeBtn}
            ></Button>
          </Link>
          <Link
            to="/rewards"
            className={pathname === '/rewards' ? 'opacity-100' : 'opacity-40'}
          >
            <Button
              className="flex items-center justify-center text-[40px] font-normal text-[#FCDB67]"
              src={Rewards}
            ></Button>
          </Link>
          <Link
            to="/leader-board"
            className={
              pathname === '/leader-board' ? 'opacity-100' : 'opacity-40'
            }
          >
            <Button
              className="flex items-center justify-center text-[40px] font-normal text-[#FCDB67]"
              src={LeaderBoard}
            ></Button>
          </Link>
        </div>
        <div className="relative flex w-full flex-col 3xl:aspect-[1.6]">
          <img
            className="hidden w-full 3xl:block"
            src={Card_background}
            alt=""
          />
          <img
            className={`hidden w-full sm:block 3xl:hidden`}
            src={Card_background_small}
            alt=""
          />
          {props.children}
        </div>
      </div>
    </div>
  )
}
