import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import ScavengersNFT from '../assets/images/ScavengersNFT.svg'
import TemNFT from '../assets/images/TemNFT.svg'
import { scavenger_nft_data } from '../scavenserdata'
import ScavengerNFT from '../components/ScavengerNFT'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import useMediaQuery from '../hooks/useMediaQuery'
import { useQuery, gql } from '@apollo/client'
import { BigNumber, ethers } from 'ethers'

const getHolderInfoQuery = (page) => {
  return gql`
    {
      holderInfos(
        skip: ${page * 10}
        first: 10
        orderBy: holdingCount
        orderDirection: desc
      ) {
        id
        holdingCount
        tokenIds
        claimed
      }
    }
  `
}
const getHistoryInfoQuery = (duration) => {
  const now = Math.floor(Date.now() / 86400000 - duration).toString()
  return gql`
    {
      histories(
        where: {id_gte: ${now}}
      ) {
        id
        holder
        hibernating
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
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function Scavengers() {
  const [page, setPage] = useState(0)
  const [duration, setDuration] = useState(90)
  const [line_data, setLineData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Hibernating',
        data: [],
      },
      {
        label: 'Holders',
        data: [],
      },
    ],
  })
  const { data, loading, error } = useQuery(getHolderInfoQuery(page))
  const { data: history } = useQuery(getHistoryInfoQuery(duration))
  const totalCountInstance = useQuery(getTotalCountQuery())
  const totalPage = Math.ceil(
    (totalCountInstance?.data?.totalCounts[0].holder ?? 0) / 10
  )
  // console.log(totalCountInstance.data.totalCounts[0].goldClaimed)
  let options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'white',
          font: {
            size: 40,
          },
          padding: 40,
        },
      },
      title: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0.2,
        borderColor: 'rgb(252, 219, 103)',
        backgroundColor: 'rgb(252, 219, 103)',
        borderWidth: 4,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverBorderWidth: 3,
        borderColor: '#fff',
        backgroundColor: 'rgb(252, 219, 103)',
      },
    },
    scales: {
      y: {
        ticks: {
          maxRotation: 0,
          maxTicksLimit: 10,
          backdropPadding: 30,
          color: '#fff',
          font: {
            size: 48,
          },
          padding: 40,
        },
        grid: {
          borderColor: 'rgba(0,0,0,0)',
          color: 'white',
          tickColor: 'rgba(0,0,0,0)',
        },
      },
      x: {
        ticks: {
          maxRotation: 0,
          maxTicksLimit: 10,
          backdropPadding: 10,
          color: '#fff',
          font: {
            size: 48,
          },
          padding: 40,
        },
        grid: {
          display: false,
          borderColor: 'rgba(0,0,0,0)',
        },
      },
    },
  }
  useEffect(() => {
    if (history) {
      const list = history.histories
      const dates = list.map((item) => {
        const date = new Date(Number(item.id) * 86400000).toLocaleDateString(
          'en-us',
          {
            // weekday: 'long',
            // year: 'numeric',
            month: 'short',
            day: 'numeric',
          }
        )
        return date
      })
      const holders = list.map((item) => Number(item.holder))
      const hibernatings = list.map((item) => Number(item.hibernating))
      setLineData({
        labels: dates,
        datasets: [
          {
            label: 'Hibernating',
            data: hibernatings,
            borderColor: 'rgb(0, 255, 163)',
            borderWidth: 4,
            backgroundColor: 'rgb(0, 255, 163)',
            color: 'rgb(0, 255, 163)',
          },
          {
            label: 'Holders',
            data: holders,
            borderWidth: 4,
          },
        ],
      })
      // console.log(dates)
    }
  }, [history])
  const large = useMediaQuery('(min-width: 2180px)')
  const sm = useMediaQuery('(max-width: 990px)')
  options.scales.x.ticks.font.size = large ? 40 : sm ? 8 : 16
  options.scales.y.ticks.font.size = large ? 40 : sm ? 8 : 16
  options.plugins.legend.labels.font.size = large ? 48 : sm ? 12 : 24
  options.plugins.legend.labels.padding = large ? 40 : sm ? 8 : 16
  options.scales.x.ticks.padding = large ? 40 : sm ? 8 : 16
  options.scales.y.ticks.padding = large ? 40 : sm ? 8 : 16
  return (
    <div
      className="W-full min-h-screen px-3 py-12 text-white lg:px-11 lg:py-[120px] 3xl:px-[260px]"
      style={{ backgroundImage: `url(${ScavengersNFT})` }}
    >
      <div className="text-2xl font-black lg:text-5xl 3xl:text-[55px]">
        <p className="text-center 3xl:text-left">Scavengers are hybernating</p>
      </div>
      <div className="mt-8 flex flex-col rounded-xl bg-[#615D8D] px-5 py-7 lg:rounded-[40px] 3xl:p-[64px]">
        <div className="mt-4 flex justify-end rounded-r-3xl text-[36px] lg:mt-16">
          <Menu as="div" className="relative inline-block text-left">
            <div className="justify-end ">
              <Menu.Button className="flex w-full items-center justify-center rounded-lg bg-[#B5B3D8] px-4 py-2 text-base font-bold text-white hover:bg-[#B5B3D8BB] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 3xl:rounded-2xl 3xl:px-16 3xl:py-9 3xl:text-4xl">
                Filter {duration}days
                <ChevronDownIcon
                  className="-mt-1 w-[30px] fill-[#444076] 3xl:w-[48px]"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="flex">
                <Menu.Items className="absolute top-0 left-[45%] z-10 mt-2 w-56 max-w-[110px] origin-top-right justify-end rounded-[13px] rounded-tl-none bg-[#B5B3D8] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none 3xl:left-[105%] 3xl:-top-[124px] 3xl:max-w-[220px] 3xl:rounded-md">
                  <div className="relative overflow-y-clip py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <div
                          onClick={() => setDuration(90)}
                          className={classNames(
                            active ? 'bg-[#0002]' : '',
                            'block px-4 py-2 text-base font-bold text-white 3xl:text-4xl'
                          )}
                        >
                          90days
                        </div>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <div
                          onClick={() => setDuration(180)}
                          className={classNames(
                            active ? 'bg-[#0002]' : '',
                            'block px-4 py-2 text-base font-bold text-white 3xl:text-4xl'
                          )}
                        >
                          180days
                        </div>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <div
                          onClick={() => setDuration(365)}
                          className={classNames(
                            active ? 'bg-[#0002]' : '',
                            'block px-4 py-2 text-base font-bold text-white 3xl:text-4xl'
                          )}
                        >
                          365days
                        </div>
                      )}
                    </Menu.Item>
                    <div className="absolute -left-[7px] -top-[8px] -z-[1] min-h-[15px] min-w-[15px] rotate-45 bg-[#B5B3D8]"></div>
                  </div>
                </Menu.Items>
              </div>
            </Transition>
          </Menu>
        </div>
        {/* <div className="flex justify-center gap-4 px-8 pt-6 text-base lg:justify-start lg:gap-20 lg:text-xl 3xl:pt-20 3xl:text-[48px]">
          <p>Global</p>
          <p>Hybernating</p>
          <p>Holders</p>
        </div> */}
        <Line options={options} data={line_data} />
      </div>
      <div className="mt-8 flex flex-col items-center justify-between gap-3 lg:mt-14 3xl:mt-36 3xl:flex-row">
        <p className="text-3xl font-black lg:text-[55px]">TOP SCAVENGERS</p>
        {/* <input
          placeholder="0x..."
          className="w-full max-w-[730px] rounded-[10px] bg-[#615D8D] px-6 py-2.5 text-base lg:text-4xl"
        /> */}
      </div>
      <div className="mt-4 flex flex-col rounded-xl bg-[#615D8D] py-6 px-3 lg:mt-12 lg:rounded-[40px] lg:py-20 lg:px-10 3xl:mt-8 3xl:px-28">
        <div className="flex items-center justify-center gap-4 lg:gap-8 3xl:justify-start">
          <img src={TemNFT} alt="" className="max-w-[60px] lg:max-w-max"></img>
          <p className="text-xl lg:text-[48px]">SCAVENGERS NFT</p>
        </div>
        <div className="mt-8 flex gap-1 pl-[42px] lg:mt-[96px] lg:gap-8 lg:pl-[82px] 3xl:gap-20 3xl:pl-[290px]">
          <p className="w-full max-w-[80px] text-xs lg:max-w-[120px] lg:text-base 3xl:max-w-[250px] 3xl:text-[36px]">
            Account
          </p>
          <p className="w-full max-w-[80px] text-xs lg:max-w-[100px] lg:text-base 3xl:max-w-[210px] 3xl:text-[36px]">
            #Scavengers
          </p>
          <p className="w-full max-w-[60px] text-xs lg:max-w-[100px] lg:text-base 3xl:max-w-[210px] 3xl:text-[36px]">
            Total Gold
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-4 lg:mt-7 3xl:mt-24">
          {data?.holderInfos.map((data, index) => (
            <ScavengerNFT
              data={data}
              key={index}
              index={index}
              page={page}
              totalClaimed={BigNumber.from(
                totalCountInstance?.data?.totalCounts[0].goldClaimed ?? '0'
              )}
            />
          ))}
          {loading && (
            <div className="flex h-[80%] w-full items-center justify-center text-5xl font-semibold text-[#FCDB67]">
              Loading...
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flex w-full justify-between text-sm lg:mt-[52px] lg:text-xl 3xl:text-[48px]">
        {page > 0 && (
          <button
            onClick={() => setPage((value) => (value === 0 ? 0 : value - 1))}
          >
            &lt; Previous
          </button>
        )}
        <p className="">
          GOLD Remaining:{' '}
          {ethers.utils.commify(
            ethers.utils.formatUnits(
              BigNumber.from('150000000000000000')
                .sub(
                  BigNumber.from(
                    totalCountInstance?.data?.totalCounts[0].goldClaimed ?? '0'
                  )
                )
                .toString(),
              9
            )
          )}{' '}
          / 150,000,000.0
        </p>
        <button
          onClick={() =>
            setPage((value) =>
              value < totalPage - 1 ? value + 1 : totalPage - 1
            )
          }
        >
          Next &gt;
        </button>
      </div>
    </div>
  )
}
