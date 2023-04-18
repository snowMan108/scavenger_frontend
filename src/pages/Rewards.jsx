import React from 'react'
import Button from '../components/Button'

import { Layout } from '../components/Layout'
import Gold from '../assets/images/Gold.svg'
import BuyGold from '../assets/images/BuyGold.svg'
import Gems from '../assets/images/Gems.svg'
import SellGold from '../assets/images/SellGold.svg'
import { useQuery, gql } from '@apollo/client'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'

const getHolderInfoQuery = (account) => {
  return gql`
    {
      holderInfos(
        where: { id: "${account ? account : 0}" },
      ) {
        id
        claimed
      }
    }
  `
}

export default function Rewards() {
  const { account } = useWeb3React()
  const { data } = useQuery(getHolderInfoQuery(account?.toLowerCase()))
  console.log(data?.holderInfos[0].claimed)
  return (
    <Layout>
      <div className="absolute m-auto flex h-full w-full flex-col justify-center px-[14%] 3xl:flex-row 3xl:gap-5 3xl:px-[6%]">
        <div className="flex w-full flex-col">
          <div className="-my-6 flex flex-col 3xl:my-0">  
            <Button
              className="flex w-full items-center justify-center pl-[10%] pt-[2%] text-base font-bold text-[#6C2804] lg:text-4xl 3xl:text-6xl"
              src={Gold}
            >
              Gold:
              {Number(data?.holderInfos[0].claimed)
                ? ethers.utils.formatUnits(data?.holderInfos[0].claimed, 9)
                : 0}
            </Button>
          </div>
          <div className="-my-6 flex flex-col 3xl:my-0">
            <Button
              className="flex w-full items-center justify-center pl-[10%] pt-[2%] text-base font-bold text-[#6C2804] lg:text-4xl 3xl:text-6xl "
              src={Gems}
            >
              Gems: TBD
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-col">
          <div className="-my-6 flex flex-col 3xl:my-0">
            <Button
              className="flex w-full items-center justify-center pl-[10%] pt-[2%] text-base font-bold text-[#6C2804] lg:text-4xl 3xl:text-6xl"
              src={BuyGold}
            >
              Buy Gold
            </Button>
          </div>
          <div className="-my-6 flex flex-col 3xl:my-0">
            <Button
              className="flex w-full items-center justify-center pl-[10%] pt-[2%] text-base font-bold text-[#6C2804] lg:text-4xl 3xl:text-6xl "
              src={SellGold}
            >
              Sell Gold
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
