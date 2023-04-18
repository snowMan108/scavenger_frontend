import { BigNumber, ethers } from 'ethers'

const ScavengerNFT = ({ data, page, index, totalClaimed }) => {
  return (
    <div className="mt-0 flex items-center gap-1 text-xs lg:mt-6 lg:gap-8 lg:text-base 3xl:gap-20 3xl:text-4xl">
      <p className="w-full max-w-[38px] lg:max-w-[50px] 3xl:max-w-[210px]">
        {page * 10 + index + 1}.
      </p>
      <p className="w-full max-w-[80px] lg:max-w-[120px] 3xl:max-w-[250px]">
        {data.id.slice(0, 4) +
          '...' +
          data.id.slice(data.id.length - 4, data.id.length)}
      </p>
      <p className="flex w-full max-w-[80px] justify-end lg:max-w-[100px] 3xl:max-w-[210px]">
        {data.tokenIds.length.toLocaleString()}
      </p>
      <p className="w-full max-w-[60px] lg:max-w-[100px] 3xl:max-w-[210px]">
        {ethers.utils.formatUnits(data.claimed ?? '0', 9)}
      </p>
      <div className="flex h-1.5 w-full justify-start rounded-full bg-[#ffffff33] lg:h-2.5">
        <div
          className={`h-1.5 rounded-full bg-[#FCDB67] lg:h-2.5`}
          style={{
            width: `${
              Number(totalClaimed) === 0
                ? 0
                : (Number(BigNumber.from(data.claimed).div(totalClaimed)) *
                    100) /
                  30
            }%`,
          }}
        ></div>
      </div>
    </div>
  )
}

export default ScavengerNFT
