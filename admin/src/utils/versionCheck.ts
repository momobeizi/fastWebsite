import axios from "axios"

/**
 * 获取最新版本信息
 * @returns version
 */
export const getLatestVersion = async () => {
   const res = await axios.get('./version.json')
   return res.data
}

/**
 * 获取当前版本信息
 * @returns version
 */

export const getCurrentVersion = () => {
    //  return process.env.VITE_APP_VERSION
    return '1.0.0'
}

/**
 * 检查版本
 * @returns 是否需要更新
 */
export const checkVersion = () =>{
    // const latestVersion = getLatestVersion()
    // const currentVersion = getCurrentVersion()
    // return latestVersion !== currentVersion
}

