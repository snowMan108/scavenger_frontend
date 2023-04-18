import React, { useEffect, useState } from 'react'

import { Layout } from '../components/Layout'
import NextBtn from '../assets/images/next-button.svg'
import SelectBtn from '../assets/images/select.svg'
import PrevBtn from '../assets/images/prev-button.svg'
import { CONTRACT_ABI, CONTRACT_ADDRESS, REWARD_ABI } from '../constants'
import Button from '../components/Button'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { getLevel } from '../utils'
import { useQuery, gql } from '@apollo/client'
import RewardCard from '../components/RewardCard'
import claim from '../assets/images/claim.svg'

const getHiberInfoQuery = (account, page) => {
  const timestamp = Math.ceil(Date.now() / 1000)
  return gql`
  {
    hibernatingInfos(
      where: {
        owner_contains_nocase: "${account}",
        started_lt: ${timestamp - 86400 * 30},
        started_gt: 0
      },      
      first: 10,
      skip: ${10 * page}
    ) {
      id
      hibernated
      started
      owner
    }
  }
`
}

const API_KEY = '48c78f9c-ac26-46c2-a3e3-8905940f5a7c'
let PAGE_SIZE = 10
export default function Claim() {
  const { account, library } = useWeb3React()
  const [page, setPage] = useState(0)
  const { data, loading, error } = useQuery(getHiberInfoQuery(account, page))
  const [showClaimBtn, setShowClaimBtn] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [nfts, setNfts] = useState([])
  const [list, setList] = useState([])
  const fetchNfts = (tokenId) => {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.nftport.xyz/v0/nfts/${CONTRACT_ADDRESS}/${tokenId}?chain=ethereum&refresh_metadata=false`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: API_KEY,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.nft) {
            resolve(
              data.nft.cached_file_url
                ? data.nft.cached_file_url
                : data.nft.file_url
            )
          } else reject('something went wrong!')
        })
        .catch((e) => {
          console.log(e)
          reject(e.message)
        })
    })
  }
  useEffect(() => {
    console.log('çlaim')
  })
  const getInfoById = async (tokenId, hiberInfo) => {
    const imageUrl = await fetchNfts(tokenId)
    const nft = {
      image: imageUrl,
      id: tokenId,
      hibernating: hiberInfo.hibernating,
      current: Number(hiberInfo.current),
      started: Math.round(Number(hiberInfo.current) / 86400),
      level: getLevel(Number(hiberInfo.current)),
    }
    return nft
  }
  useEffect(() => {
    if (account && data && data.hibernatingInfos) {
      if (data.hibernatingInfos.length === 10) {
        setHasMore(true)
      } else setHasMore(false)
      const resultPromises = data.hibernatingInfos.map(async (item) => {
        const hiberInfo = {
          hibernating: item.hibernated,
          current: Math.ceil(Date.now() / 1000) - Number(item.started),
        }
        const info = await getInfoById(Number(item.id), hiberInfo)
        return info
      })
      Promise.all(resultPromises)
        .then((res) => {
          console.log(res)
          setNfts(res)
        })
        .catch((e) => console.log(e))
    }
  }, [account, data])
  const onClaim = async (tokenIds) => {
    const signer = library.getSigner()

    const ids = tokenIds.map((id) => ethers.BigNumber.from(id))
    try {
      const tx = await RewardPool.claimReward(ids)
      await tx.wait()
      window.location.reload()
    } catch (e) {
      console.log(e)
    }
  }
  const getMore = () => {
    setPage(value + 1)
  }
  const handleSelect = async (element) => {
    const id = element.id
    const isExist = list.includes(id)
    if (isExist) {
      const newList = list.filter((element) => element !== id)
      setList(newList)
    } else {
      const signer = library.getSigner()
      const SWTF = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

      if (!approved) {
        await tx.wait()
      }
      const newList = [...list, id]
      setList(newList)
    }
  }
  useEffect(() => {
    if (list.length === 0) {
      setShowClaimBtn(false)
    } else setShowClaimBtn(true)
  }, [list])
  return (
    <>
      <Layout>
        <div className="m-auto flex h-full w-full flex-col justify-start gap-5 py-8 pl-[5%] pr-[4%] sm:absolute lg:py-20 3xl:pr-[4%] 3xl:pl-[7%]">
          <div className="hidden w-full grid-cols-5 gap-5 gap-y-2 3xl:grid">
            {nfts
              .slice(page * PAGE_SIZE, PAGE_SIZE * (page + 1))
              .map((data, index) => (
                <RewardCard
                  data={data}
                  key={index}
                  onClaim={() => onClaim([data.id])}
                  onSelect={() => handleSelect(data)}
                  isSelected={list.includes(data.id)}
                />
              ))}
          </div>

          <div className="grid w-full gap-1 gap-y-0 sm:grid-cols-2 lg:gap-5 lg:gap-y-2 3xl:hidden">
            {nfts
              .slice(page * PAGE_SIZE, PAGE_SIZE * (page + 1))
              .map((data, index) => (
                <RewardCard
                  data={data}
                  key={index}
                  onClaim={() => onClaim([data.id])}
                  onSelect={() => handleSelect(data)}
                  isSelected={list.includes(data.id)}
                />
              ))}
          </div>
          <div className="flex w-full justify-center gap-4 px-6 3xl:justify-between">
            {page > 0 && (
              <Button
                onClick={() =>
                  setPage((value) => (value === 0 ? 0 : value - 1))
                }
                className="flex items-center justify-center"
                src={PrevBtn}
              ></Button>
            )}

            {hasMore || PAGE_SIZE * (page + 1) < nfts.length ? (
              <Button
                onClick={getMore}
                className="flex items-center justify-center"
                src={NextBtn}
              ></Button>
            ) : (
              <div></div>
            )}
          </div>
          {nfts.length > 0 ? (
            <div className="mb-0 flex flex-grow justify-center gap-4 text-2xl text-white">
              {showClaimBtn && (
                <Button
                  onClick={() => onClaim(list)}
                  className="flex items-center justify-center"
                  src={claim}
                ></Button>
              )}
              {!showClaimBtn && (
                <div className="mb-0">
                  <img src={SelectBtn} alt="" />
                </div>
              )}
            </div>
          ) : (
            nfts.length === 0 && (
              <div className="flex h-[80%] w-full items-center justify-center text-5xl font-semibold text-[#FCDB67]"></div>
            )
          )}
          <div className="mb-0 flex flex-col gap-4">
            <div className="text-2xl text-white">
              GOLD token contract: 0xA2aD46Da4F05c54c1C8F10AC33232049DB63cf51
            </div>

            <div className="text-2xl text-white">
              <a href="https://www.alphr.com/add-token-metamask/">
                {' '}
                Tip: How to add token to your metamask{' '}
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
