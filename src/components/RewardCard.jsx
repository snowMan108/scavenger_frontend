import Card from '../assets/images/Card.svg'
import HourGlass from '../assets/images/hour-glass.svg'
import LevelPanel from '../assets/images/hiber-status.svg'
import transferIcon from '../assets/images/paper-plane.svg'
import eyeClosed from '../assets/images/eye-closed.svg'
import claim from '../assets/images/claim.svg'
import checkIcon from '../assets/images/check.svg'
import plusIcon from '../assets/images/plus.svg'
import WalletStatus from '../assets/images/gold-amount.svg'
import { useWeb3React } from '@web3-react/core'
import Button from './Button'
import { ethers } from 'ethers'

import { useEffect, useMemo, useState } from 'react'

const RewardCard = ({ data, onClaim, onSelect, isSelected }) => {
  const { library, account } = useWeb3React()

  useEffect(() => {
    async function getReward() {
      const signer = library.getSigner()

      const rewardAmount = await REWARD.connect(signer)[
        'calculateReward(uint256)'
      ](data.id)
      setReward(Number(ethers.utils.formatUnits(rewardAmount, 9)))
    }
    getReward()
  }, [account])

  return (
    <div className="group relative flex cursor-pointer" onClick={onSelect}>
      <img className="w-full" src={Card} alt="" />
      <div className="absolute flex h-full w-full flex-col pt-[12%] pb-[13%] pl-[14%] pr-[12%] 3xl:gap-1 4xl:gap-3">
        <img
          className="w-full rounded-[20px] border-2 border-[#1A0800]"
          src={data.image}
          alt=""
        />
        {isSelected && (
          <div className="bg-burn absolute aspect-square w-[74%] rounded-[20px]"></div>
        )}
        <img
          className="absolute top-[15%] right-[18%] max-w-[16px] cursor-pointer lg:right-[16%] lg:top-[13%] lg:max-w-max"
          src={transferIcon}
          alt=""
        />
        <img
          className="absolute top-[55%] right-[18%] max-w-[12px] cursor-pointer lg:right-[16%] lg:top-[58%] lg:max-w-max"
          src={eyeClosed}
          alt=""
        />
        <img
          src={isSelected ? checkIcon : plusIcon}
          className={`absolute top-[13%] left-[18%] ${
            !isSelected && 'hidden group-hover:block'
          }`}
        />
        <div className="flex w-full items-center gap-0.5 lg:gap-1.5">
          <p className="flex-grow text-left text-xs font-bold text-[#FCDB67] lg:text-xl">
            #{data.id}
          </p>
          <img className="max-w-[16px] lg:max-w-max" src={HourGlass} alt="" />
          <p className="text-xs font-normal text-[#FCDB67] lg:text-xl">
            {data.hibernating ? data.started : 0} days
          </p>
        </div>
        <div
          onClick={(e) => {
            onClaim(data.id)
            e.stopPropagation()
          }}
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center"
        >
          <img className="w-full px-8" src={claim} alt="" />
        </div>
      </div>
      <div className="absolute -top-5">
        <Button
          src={WalletStatus}
          className="flex items-center justify-center pl-[33%] pr-[6%] text-xs font-semibold text-[#6C2804] lg:text-xl"
        >
          <b>{reward.toFixed(2)}</b>
        </Button>
      </div>
    </div>
  )
}

export default RewardCard
