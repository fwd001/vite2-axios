const CacheApiLength = 10

export default class CacheItem {
    constructor(config) {
        this.url = config.url;
        this.params = CacheItem.setParams(config)
        this.expireDate = 0;
        this.response = {};
        this.weights = 0;
        this.c = () => {}
    }

    // 设置时间
    setExpireDate(time = 10000) {
        const cur = new Date().getTime();
        this.expireDate = cur + time;
    }

    // 设置数据
    setResponse(data = {}) {
        this.response = data;
    }

    // 设置权重
    setWeights(weights) {
        if (weights !== undefined) {
            this.weights = weights;
        } else {
            this.weights += 1;
        }
    }

    // 设置取消函数
    setCancel(c = ()=>{}) {
        this.c = c
    }

    //   设置Params
    static setParams(config) {
        let params = null
        if (config.params) {
            params = config.params;
        } else if (config.data) {
            params = config.data;
        }
        return params
    }

    // 返回缓存 undefined为没有缓存 
    static getCache(reqList = [], config) {
        const item = reqList.find(item => {
            let flag = false
            if (item.url === config.url) {
                const params = this.setParams(config)
                const cParams = item.params
                if (CacheItem.deepEqual(params, cParams)) {
                    flag = true
                }
            }
            return flag
        })
        return item
    }

    // 返回缓存下标 -1 没找到
    static getIndex(reqList = [], config) {
        let index = -1
        const _index = reqList.findIndex(item => {
            if (item.url === config.url) {
                const params = this.setParams(config)
                const cParams = item.params
                if ( CacheItem.deepEqual(params, cParams)) {
                    return true
                }
            }
        })
        index = _index
        return index
    }
    // 添加缓存，控制缓存 总数
    static push(reqList = [], item) {
        if (reqList.length >= CacheApiLength) {
            reqList.sort((a, b)=> b.weights - a.weights)
            reqList.pop()
        }
        reqList.push(item)
    }


    /*
     * 判断两个对象相等
     * @param x {Object} 对象1
     * @param y {Object} 对象2
     * @return  {Boolean} true 为相等，false 为不等
     */
    static deepEqual(x, y) {
        // 指向同一内存时
        if (x === y) {
            return true;
        } else if (
            typeof x == "object" &&
            x != null &&
            typeof y == "object" &&
            y != null
        ) {
            if (Object.keys(x).length != Object.keys(y).length) return false;

            for (var prop in x) {
                if (y.hasOwnProperty(prop)) {
                    if (!CacheItem.deepEqual(x[prop], y[prop])) return false;
                } else return false;
            }

            return true;
        } else return false;
    }
}
