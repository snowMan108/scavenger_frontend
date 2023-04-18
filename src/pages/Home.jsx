import React, { useEffect, useState } from 'react'

import { Layout } from '../components/Layout'
import NextBtn from '../assets/images/next-button.svg'
import SelectBtn from '../assets/images/select.svg'
import HibernateBtn from '../assets/images/hibernate_btn.svg'
import ExitBtn from '../assets/images/exit.svg'
import PrevBtn from '../assets/images/prev-button.svg'
import Modal from '../assets/images/modal.svg'
import YES from '../assets/images/YES.svg'
import NO from '../assets/images/NO.svg'
import NFTCard from '../components/Card'
import { CONTRACT_ABI, CONTRACT_ADDRESS, nft_data } from '../constants'
import Button from '../components/Button'
import { ethers, BigNumber } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { getLevel } from '../utils'
import { useQuery, gql } from '@apollo/client'

const getHiberInfoQuery = (account) => {
  // const timestamp = Math.ceil(Date.now() / 1000)
  return gql`
  {
    hibernatingInfos(
      where: {
        owner_contains_nocase: "${account}",
      }
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
export default function Home() {
  const { account, library } = useWeb3React()
  const { data, loading, error } = useQuery(getHiberInfoQuery(account))
  const [showHiber, setShowHiber] = useState(false)
  const [showUnhiber, setShowUnhiber] = useState(false)
  const [token, setToken] = useState('')
  const [nfts, setNfts] = useState([])
  const [page, setPage] = useState(0)
  const [loadingPort, setLoading] = useState()
  const [list, setList] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [single, setSingle] = useState('')
  const fetchNfts = (account, token = '') => {
    console.log('getting started', account, token)
    setLoading(true)
    if (token === '') setNfts([])
    fetch(
      `https://api.nftport.xyz/v0/accounts/${account}?chain=ethereum&contract_address=${CONTRACT_ADDRESS}&include=metadata&page_size=50${
        token ? '&continuation=' + token : ''
      }`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: API_KEY,
        },
      }
    )
      .then((response) => response.json())
      .then(async (data) => {
        if (data.continuation) {
          setToken(data.continuation)
        } else {
          setToken('')
        }
        if (data.nfts) {
          const nftDatas = []
          for (let index in data.nfts) {
            const nft = data.nfts[index]
            const hiberInfo = await getInfoById(Number(nft.token_id))
            //if (hiberInfo == null) continue;
            //const current = Date.now()/1000;
            //if (hiberInfo.started > 0 && hiberInfo.started < current - 86400 * 30) continue;
            const nft_data = {
              image: nft.cached_file_url ? nft.cached_file_url : nft.file_url,
              id: nft.token_id,
              hibernating: hiberInfo.hibernating,
              current: Number(hiberInfo.current),
              started: Math.round(Number(hiberInfo.current) / 86400),
              level: getLevel(Number(hiberInfo.current)),
            }
            nftDatas.push(nft_data)
          }
          if (token) {
            setNfts((value) => [...value, ...nftDatas])
          } else setNfts(nftDatas)
          setLoading(false)
        }
      })
      .catch((e) => {
        console.log(e)
        setLoading(false)
      })
  }
  useEffect(() => {
    if (!account) return setNfts([])
    if (account && data) return fetchNfts(account)
  }, [account, data])
  const getInfoById = async (tokenId) => {
    const hiberInfos = data.hibernatingInfos
    const ret = hiberInfos.filter((value) => parseInt(value.id, 16) === tokenId)
    if (ret.length === 0) return null
    return {
      hibernating: ret[0].hibernated,
      current: Math.ceil(Date.now() / 1000) - Number(ret[0].started),
      started: Number(ret[0].started),
    }
  }
  const onHibernate = async (tokenId) => {
    setShowConfirm(true)
    setSingle(`${tokenId}`)
  }
  const toggleHibernating = async () => {
    setShowConfirm(true)
    setSingle('')
  }
  /*const handleConfirm = async () => {
    const signer = library.getSigner()
    const SWTF = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
    
    try {
      const tokenIds =
        single === ''
          ? list.map((id) => ethers.BigNumber.from(id))
          : [ethers.BigNumber.from(single)]
      const tx = await SWTF.toggleHibernating(tokenIds)
      await tx.wait()
      window.location.reload()
    } catch (e) {
      console.log(e)
      setShowConfirm(false)
    }
  }*/

  const handleConfirm = async () => {
    const signer = library.getSigner()

    //const ids = tokenIds.map((id) => ethers.BigNumber.from(id))
    try {
      const tokenIds =
        single === ''
          ? list.map((id) => ethers.BigNumber.from(id))
          : [ethers.BigNumber.from(single)]
      const tx = await RewardPool.claimReward(tokenIds)
      await tx.wait()
      window.location.reload()
    } catch (e) {
      console.log(e)
    }
  }

  const getMore = () => {
    if (PAGE_SIZE * (page + 1) === nfts.length) {
      if (token !== '') {
        console.log('hello', token)
        setPage((value) => value + 1)
        fetchNfts(account, token)
      }
    } else {
      setPage((value) => value + 1)
    }
  }
  // console.log(nfts.length, page)
  const handleSelect = (element) => {
    if (list.length === 0) return setList([element.id])
    const id = element.id
    const isExist = list.includes(id)
    if (isExist) {
      const newList = list.filter((element) => element !== id)
      setList(newList)
    } else {
      const item = nfts.filter((nft) => nft.id === list[0])[0]
      if (item.hibernating === element.hibernating) {
        const newList = [...list, id]
        setList(newList)
      } else {
        setList([id])
      }
    }
  }
  useEffect(() => {
    if (list.length === 0) {
      setShowHiber(false)
      setShowUnhiber(false)
    } else {
      let isHibernated = true
      let isUnhibernated = true
      list.map((id) => {
        const item = nfts.filter((nft) => nft.id === id)[0]
        isHibernated = isHibernated && item.hibernating
        isUnhibernated = isUnhibernated && !item.hibernating
      })
      if (isHibernated) {
        setShowHiber(false)
        setShowUnhiber(true)
      } else {
        if (isUnhibernated) {
          setShowUnhiber(false)
          setShowHiber(true)
        } else {
          setShowHiber(false)
          setShowUnhiber(false)
        }
      }
    }
  }, [list])
  console.log('nfts', nfts)
  return (
    <>
      <Layout>
        <div className="m-auto flex h-full w-full flex-col justify-start gap-5 py-8 pl-[5%] pr-[4%] sm:absolute lg:py-20 3xl:pr-[4%] 3xl:pl-[7%]">
          {loadingPort || loading ? (
            <div className="flex h-[80%] w-full items-center justify-center text-5xl font-semibold text-[#FCDB67]">
              Loading...
            </div>
          ) : (
            // <div className="grid w-full 3xl:grid-cols-5 grid-cols-2 gap-5 gap-y-2">
            <div className="hidden w-full grid-cols-5 gap-5 gap-y-2 3xl:grid">
              {nfts
                .slice(page * PAGE_SIZE, PAGE_SIZE * (page + 1))
                .map((data, index) => (
                  <NFTCard
                    data={data}
                    key={index}
                    onHibernate={onHibernate}
                    onSelect={() => handleSelect(data)}
                    isSelected={list.includes(data.id)}
                  />
                ))}
            </div>
          )}
          {
            <div className="grid w-full gap-1 gap-y-0 sm:grid-cols-2 lg:gap-5 lg:gap-y-2 3xl:hidden">
              {nfts.slice(0, 8).map((data, index) => (
                <NFTCard
                  data={data}
                  key={index}
                  onHibernate={onHibernate}
                  onSelect={() => handleSelect(data)}
                  isSelected={list.includes(data.id)}
                />
              ))}
            </div>
          }
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
            {nfts.length > 0 ? (
              <div className="flex flex-grow justify-center gap-4 text-2xl text-white">
                {showHiber && (
                  <Button
                    onClick={toggleHibernating}
                    className="flex items-center justify-center"
                    src={HibernateBtn}
                  ></Button>
                )}
                {showUnhiber && (
                  <Button
                    onClick={toggleHibernating}
                    className="flex items-center justify-center"
                    src={ExitBtn}
                  ></Button>
                )}
                {!showHiber && !showUnhiber && <img src={SelectBtn} alt="" />}
              </div>
            ) : (
              !(loadingPort || loading) && (
                <div className="flex h-[80%] w-full items-center justify-center text-5xl font-semibold text-[#FCDB67]">
                  No data
                </div>
              )
            )}
            {token !== '' || PAGE_SIZE * (page + 1) < nfts.length ? (
              <Button
                onClick={getMore}
                className="flex items-center justify-center"
                src={NextBtn}
              ></Button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </Layout>
      {showConfirm && (
        <div className="fixed top-0 left-0 flex min-h-screen w-full items-center justify-center bg-[#ffffff33]">
          <div className="relative">
            <img src={Modal} alt="" />
            <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center px-[22%] py-[12%] ">
              {single === '' ? (
                <p className="lacquer px-20 text-center text-5xl font-normal uppercase leading-[58px] text-[#FCDB67]">
                  ARE YOU SURE YOU WANT TO{' '}
                  {!nfts.filter((nft) => nft.id === list[0])[0]?.hibernating
                    ? 'HIBERATE THE SELECTED ITEMS'
                    : 'exit hibernation for the selected item'}{' '}
                  ?
                </p>
              ) : (
                <p className="lacquer px-20 text-center text-5xl font-normal uppercase leading-[58px] text-[#FCDB67]">
                  ARE YOU SURE YOU WANT TO HIBERNATE #{single}?
                </p>
              )}
              <div className="mt-24 flex gap-[150px]">
                <button onClick={handleConfirm}>
                  <img src={YES} alt="" />
                </button>
                <button onClick={() => setShowConfirm(false)}>
                  <img src={NO} alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
