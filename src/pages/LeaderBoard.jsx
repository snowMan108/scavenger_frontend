import React, { useEffect, useState } from 'react'
import Button from '../components/Button'

import { Layout } from '../components/Layout'

import Total from '../assets/images/Total.svg'
import Hybernating from '../assets/images/Hybernating.svg'
import Level1 from '../assets/images/Level1.svg'
import Level2 from '../assets/images/Level2.svg'
import Level3 from '../assets/images/Level3.svg'
import Level4 from '../assets/images/Level4.svg'
import { Link } from 'react-router-dom'
import { commafy, getLevel } from '../utils'
import { useWeb3React } from '@web3-react/core'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../constants'
import { ethers } from 'ethers'
import Scavengers from './Scavengers'
import { useQuery, gql } from '@apollo/client'

const getHiberInfoQuery = (page) => {
  return gql`
    {
      hibernatingInfos(
        where: { tokenId_gte: ${page * 1000}, tokenId_lt: ${
    (page + 1) * 1000
  }, hibernated: true },
        first: 1000,
        orderBy: tokenId
      ) {
        tokenId
        hibernated
        started
        owner
      }
    }
  `
}
const getTotalCountQuery = () => {
  return gql`
    {
      totalCounts {
        id
        hibernating
        holder
        goldClaimed
      }
    }
  `
}
let page = 0
// const API_KEY = '48c78f9c-ac26-46c2-a3e3-8905940f5a7c'
export default function LeaderBoard() {
  const { account, library } = useWeb3React()
  // const [page, setPage] = useState(0)
  const { data, loading, error } = useQuery(getHiberInfoQuery(page))
  const totalCountInstance = useQuery(getTotalCountQuery())
  const [total, setTotal] = useState(0)
  const [lv1, setLv1] = useState(0)
  const [lv2, setLv2] = useState(0)
  const [lv3, setLv3] = useState(0)
  const [lv4, setLv4] = useState(0)
  useEffect(() => {
    if (data) {
      const hibernated = data.hibernatingInfos
      let lvl1 = 0
      let lvl2 = 0
      let lvl3 = 0
      let lvl4 = 0
      for (let index in hibernated) {
        const item = hibernated[index]
        const hiberInfo = {
          hibernating: item.hibernated,
          current: Math.ceil(Date.now() / 1000) - Number(item.started),
        }
        if (hiberInfo.hibernating) {
          const lvl = getLevel(hiberInfo.current)
          switch (lvl) {
            case 1:
              lvl1 += 1
              break
            case 2:
              lvl2 += 1
              break
            case 3:
              lvl3 += 1
              break
            case 4:
              lvl4 += 1
              break
            default:
              break
          }
        }
      }
      if (page === 0) {
        setLv1(lvl1)
        setLv2(lvl2)
        setLv3(lvl3)
        setLv4(lvl4)
      } else {
        setLv1((value) => value + lvl1)
        setLv2((value) => value + lvl2)
        setLv3((value) => value + lvl3)
        setLv4((value) => value + lvl4)
      }
      if (page < 10) page += 1
    }
  }, [data])
  useEffect(() => {
    return () => {
      page = 0
    }
  }, [])
  // const fetchNfts = (account, token = '') => {
  //   const data = fetch(
  //     `https://api.nftport.xyz/v0/accounts/${account}?chain=ethereum&contract_address=${CONTRACT_ADDRESS}&include=metadata&page_size=1${
  //       token ? '&continuation=' + token : ''
  //     }`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         authorization: API_KEY,
  //       },
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then(async (data) => {
  //       if (data.nfts) {
  //         const hasMore = total + data.nfts.length < data.nfts.total
  //         let hiber = 0
  //         let lvl1 = 0
  //         let lvl2 = 0
  //         let lvl3 = 0
  //         let lvl4 = 0
  //         for (let index in data.nfts) {
  //           const nft = data.nfts[index]
  //           const hiberInfo = await getInfoById(
  //             ethers.BigNumber.from(nft.token_id)
  //           )
  //           if (hiberInfo.hibernating) hiber += 1
  //           if (hiberInfo.hibernating) {
  //             const lvl = getLevel(Number(hiberInfo.current))
  //             switch (lvl) {
  //               case 1:
  //                 lvl1 += 1
  //                 break
  //               case 2:
  //                 lvl2 += 1
  //                 break
  //               case 3:
  //                 lvl3 += 1
  //                 break
  //               case 4:
  //                 lvl4 += 1
  //                 break
  //               default:
  //                 break
  //             }
  //           }
  //         }
  //         setLv1((value) => value + lvl1)
  //         setLv2((value) => value + lvl2)
  //         setLv3((value) => value + lvl3)
  //         setLv4((value) => value + lvl4)
  //         if (hasMore) {
  //           fetchNfts(account, data.continuation)
  //         }
  //       }
  //     })
  //     .catch((e) => {
  //       console.log(e)
  //     })
  // }
  const getTotalCount = async () => {
    const signer = library.getSigner()
    const SWTF = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
    try {
      const count = await SWTF.totalSold()
      setTotal(count)
    } catch (e) {
      console.log(e)
      setTotal(0)
    }
  }
  useEffect(() => {
    if (account) getTotalCount()
  }, [account])
  return (
    <div className="flex flex-col">
      <Layout>
        <div className="justyfy-center flex h-full w-full flex-col justify-center gap-4 px-[24%] sm:absolute sm:py-40 lg:gap-12 3xl:gap-20 3xl:px-40">
          <div className="flex w-full flex-col justify-center gap-4 lg:gap-12 3xl:flex-row 3xl:gap-60">
            {/* <Link to="/scavengers" className="flex flex-col"> */}
            <Button
              className="flex w-full flex-col items-center justify-center lg:gap-2 3xl:gap-3"
              src={Total}
            >
              <p className="text-sm font-black text-white lg:text-2xl 3xl:text-4xl">
                Total
              </p>
              <p className="text-2xl font-black text-[#FCDB67] lg:text-[64px] lg:leading-[68px] 3xl:text-8xl 3xl:leading-[100px]">
                {total.toLocaleString()}
              </p>
            </Button>
            {/* </Link> */}
            <Button
              className="flex w-full flex-col items-center justify-center lg:gap-2 3xl:gap-3"
              src={Hybernating}
            >
              <p className="text-sm font-black text-white lg:text-2xl 3xl:text-4xl">
                Hybernating
              </p>
              <p className="text-2xl font-black text-[#FCDB67] lg:text-[64px] lg:leading-[68px] 3xl:text-8xl 3xl:leading-[100px]">
                {totalCountInstance.data?.totalCounts[0].hibernating?.toLocaleString() ??
                  0}
              </p>
            </Button>
          </div>
          <div className="flex w-full flex-col justify-center gap-4 lg:gap-12 3xl:flex-row 3xl:gap-60">
            <Button
              className="flex w-full flex-col items-center justify-center lg:gap-2 3xl:gap-3"
              src={Level1}
            >
              <p className="text-sm font-black text-white lg:text-2xl 3xl:text-4xl">
                Level1 unlocked
              </p>
              <p className="text-2xl font-black text-[#FCDB67] lg:text-[64px] lg:leading-[68px] 3xl:text-8xl 3xl:leading-[100px]">
                {lv1.toLocaleString()}
              </p>
            </Button>
            <Button
              className="flex w-full flex-col items-center justify-center lg:gap-2 3xl:gap-3"
              src={Level2}
            >
              <p className="text-sm font-black text-white lg:text-2xl 3xl:text-4xl">
                Level2 unlocked
              </p>
              <p className="text-2xl font-black text-[#FCDB67] lg:text-[64px] lg:leading-[68px] 3xl:text-8xl 3xl:leading-[100px]">
                {lv2.toLocaleString()}
              </p>
            </Button>
          </div>
          <div className="flex w-full flex-col justify-center gap-4 lg:gap-12 3xl:flex-row 3xl:gap-60">
            <Button
              className=" flex w-full flex-col items-center justify-center lg:gap-2 3xl:gap-3"
              src={Level3}
            >
              <p className="text-sm font-black text-white lg:text-2xl 3xl:text-4xl">
                Level3 unlocked
              </p>
              <p className="text-2xl font-black text-[#FCDB67] lg:text-[64px] lg:leading-[68px] 3xl:text-8xl 3xl:leading-[100px]">
                {lv3.toLocaleString()}
              </p>
            </Button>

            <Button
              className="flex w-full flex-col items-center justify-center lg:gap-2 3xl:gap-3"
              src={Level4}
            >
              <p className="text-sm font-black text-white lg:text-2xl 3xl:text-4xl">
                Level4 unlocked
              </p>
              <p className="text-2xl font-black text-[#FCDB67] lg:text-[64px] lg:leading-[68px] 3xl:text-8xl 3xl:leading-[100px]">
                {lv4.toLocaleString()}
              </p>
            </Button>
          </div>
          <p className="flex w-full justify-center whitespace-nowrap text-lg font-bold text-white lg:text-2xl 3xl:mt-4 3xl:text-5xl">
            Total GOLD claimed:{' '}
            {Number(totalCountInstance.data?.totalCounts[0].goldClaimed)
              ? ethers.utils.formatUnits(
                  totalCountInstance.data?.totalCounts[0].goldClaimed,
                  9
                )
              : 0}
          </p>
        </div>
      </Layout>
      <Scavengers />
    </div>
  )
}
