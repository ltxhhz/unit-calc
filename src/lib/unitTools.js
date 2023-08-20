var o = 14, n = 7, l = 4;
const axios = require('axios');

const getExchanges = async function () {
    let exchanges = utools.dbStorage.getItem("exchanges");
    if (exchanges){
        exchanges = JSON.parse(exchanges);
        // 判断 exchanges.build_time 是否超出一天
        let now = new Date().getTime();
        let buildTime = new Date(exchanges.build_time).getTime();
        if (now - buildTime > 24 * 60 * 60 * 1000){
            exchanges = false;
        }
    }
    if (exchanges){
        return exchanges.data;
    }
    return Promise.race([
        axios("https://ghproxy.com/https://raw.githubusercontent.com/other-blowsnow/exchange_reptile/master/exchange.json"),
        axios("https://cdn.jsdelivr.net/gh/other-blowsnow/exchange_reptile/exchange.json")
    ]).then(res => {
        utools.dbStorage.setItem("exchanges",JSON.stringify(res.data));
        return res.data.data;
    })
}
const exchange = async function (value, srcUnit , toUnit){
    let exchanges = await getExchanges();
    let srcExchangeItem = exchanges.find(item => item.name === srcUnit);
    if (srcUnit === "人民币"){
        srcExchangeItem = {
            price: 1
        }
    }
    if (!srcExchangeItem) return 0;
    // 人民币金额
    let rate = srcExchangeItem.price;
    if (toUnit === "人民币"){
        return value * rate;
    }
    let toExchangeItem = exchanges.find(item => item.name === toUnit);
    if (!toExchangeItem) return 0;
    let price = (value * rate) / toExchangeItem.price;

    return parseFloat(price.toFixed(6))
}

var data = {
    length: {
        name: '长度换算',
        alias: {
            "千米": "km",
            "米": "m",
            "分米": "dm",
            "厘米": "cm",
            "毫米": "mm",
            "微米": "um",
            "纳米": "nm",
            "皮米": "pm",
            "光年": "ly",
            "天文单位": "AU",
            "英寸": "in",
            "英尺": "ft",
            "码": "yd",
            "英里": "mi",
            "海里": "nmi",
            "英寻": "fm",
            "弗隆": "fur",
            "密耳": "mil",
        },
        calc: {
            "千米": "(x*1)/1000_千米(km)",
            "米": "(x*1)/1_米(m)",
            "分米": "(x*1)*10_分米(dm)",
            "厘米": "(x*1)*100_厘米(cm)",
            "毫米": "(x*1)*1000_毫米(mm)",
            "微米": "(x*1)*1000000_微米(um)",
            "纳米": "(x*1)*1000000000_纳米(nm)",
            "皮米": "(x*1)*1000000000000_皮米(pm)",
            "光年": "(x*1)/9460730472580800_光年(ly)",
            "天文单位": "(x*1)/149597870700_天文单位(AU)",
            "英寸": "(x*1)/(0.3048/12)_英寸(in)",
            inch: "(x*1)/(0.3048/12)_inch(in)",
            "英尺": "(x*1)/0.3048_英尺(ft)",
            "码": "(x*1)/(0.3048*3)_码(yd)",
            "英里": "(x*1)/(0.3048*3*1760)_英里(mi)",
            "海里": "(x*1)/1852_海里(nmi)",
            "英寻": "(x*1)/1.8288_英寻(fm)",
            "弗隆": "(x*1)/201.168_弗隆(fur)",
            "密耳": "(x*1)/(0.3048/12)*1000_密耳(mil)",
            "里": "(x*1)/500_里",
            "丈": "(x*1)/(10/3)_丈",
            "尺": "(x*1)/(1/3)_尺",
            "寸": "(x*1)/(1/10/3)_寸",
            "分": "(x*1)/(1/100/3)_分",
            "厘": "(x*1)/(1/1000/3)_厘",
            "毫": "(x*1)/(1/10000/3)_毫"
        },
        init: {
            "千米": "(x*1000)/1_米",
            "米": "(x*1)/1_米",
            "分米": "(x*1/10)/1_米",
            "厘米": "(x*1/100)/1_米",
            "毫米": "(x*1/1000)/1_米",
            "微米": "(x*1/1000000)/1_米",
            "纳米": "(x*1/1000000000)/1_米",
            "皮米": "(x*1/1000000000000)/1_米",
            "光年": "(x*9460730472580800)/1_米",
            "天文单位": "(x*149600000000)/1_米",
            "英寸": "(x*(0.3048/12))/1_米",
            inch: "(x*(0.3048/12))/1_米",
            "英尺": "(x*0.3048)/1_米",
            "码": "(x*(0.3048*3))/1_米",
            "英里": "(x*(0.3048*3*1760))/1_米",
            "海里": "(x*1852)/1_米",
            "英寻": "(x*1.8288)/1_米",
            "弗隆": "(x*201.168)/1_米",
            "密耳": "(x*(0.3048/12))/1/1000_米",
            "里": "(x*500)/1_米",
            "丈": "(x*(10/3))/1_米",
            "尺": "(x*(1/3))/1_米",
            "寸": "(x*(1/10/3))/1_米",
            "分": "(x*(1/100/3))/1_米",
            "厘": "(x*(1/1000/3))/1_米",
            "毫": "(x*(1/10000/3))/1_米"
        },
        iu: "米(m)",
        group: [{
            label: "公制",
            options: ["千米", "米", "分米", "厘米", "毫米", "微米", "纳米", "皮米", "光年", "天文单位"]
        }, {
            label: "英制",
            options: ["英寸", "inch", "英尺", "码", "英里", "海里", "英寻", "弗隆", "密耳"]
        }, {
            label: "市制",
            options: ["里", "丈", "尺", "寸", "分", "厘", "毫"]
        }]
    },
    area: {
        name: '面积换算',
        alias: {
            "平方千米": ['km²'],
            "公顷": ['ha'],
            "公亩": ['are'],
            "平方米": ['㎡'],
            "平方分米": ['dm²'],
            "平方厘米": ['cm²'],
            "平方毫米": ['mm²'],
            "英亩": ['mm²'],
        },
        calc: {
            "平方千米": "(x*1)/1000000_平方千米(km²)",
            "公顷": "(x*1)/10000_公顷(ha)",
            "公亩": "(x*1)/100_公亩(are)",
            "平方米": "(x*1)/1_平方米(㎡)",
            "平方分米": "(x*1)*100_平方分米(dm²)",
            "平方厘米": "(x*1)*10000_平方厘米(cm²)",
            "平方毫米": "(x*1)*1000000_平方毫米(mm²)",
            "英亩": "(x*1)/(Math.pow(0.3048,2)*Math.pow(16.5,2)*160)_英亩(acre)",
            "平方英里": "(x*1)/Math.pow((0.3048*3*1760),2)_平方英里(sq.mi)",
            "平方码": "(x*1)/(Math.pow(0.3048,2)*9)_平方码(sq.yd)",
            "平方英尺": "(x*1)/Math.pow(0.3048,2)_平方英尺(sq.ft)",
            "平方英寸": "(x*1)/(Math.pow(0.3048,2)/144)_平方英寸(sq.in)",
            "平方竿": "(x*1)/(Math.pow(0.3048,2)*Math.pow(16.5,2))_平方竿(sq.rd)",
            "顷": "(x*1)/(100/0.0015)_顷",
            "亩": "(x*1)/(1/0.0015)_亩",
            "分": "(x*1)/(1/0.015)_分",
            "平方尺": "(x*1)/(1/9)_平方尺",
            "平方寸": "(x*1)/(0.01/9)_平方寸"
        },
        init: {
            "平方千米": "(x*1000000)/1_平方米",
            "公顷": "(x*10000)/1_平方米",
            "公亩": "(x*100)/1_平方米",
            "平方米": "(x*1)/1_平方米",
            "平方分米": "(x/100)/1_平方米",
            "平方厘米": "(x/10000)/1_平方米",
            "平方毫米": "(x/1000000)/1_平方米",
            "英亩": "(x*(Math.pow(0.3048,2)*Math.pow(16.5,2)*160))/1_平方米",
            "平方英里": "(x*Math.pow((0.3048*3*1760),2))/1_平方米",
            "平方码": "(x*(Math.pow(0.3048,2)*9))/1_平方米",
            "平方英尺": "(x*(Math.pow(0.3048,2)))/1_平方米",
            "平方英寸": "(x*(Math.pow(0.3048,2)/144))/1_平方米",
            "平方竿": "(x*(Math.pow(0.3048,2)*Math.pow(16.5,2)))/1_平方米",
            "顷": "(x*(100/0.0015))/1_平方米",
            "亩": "(x*(1/0.0015))/1_平方米",
            "分": "(x*(1/0.015))/1_平方米",
            "平方尺": "(x*(1/9))/1_平方米",
            "平方寸": "(x*(0.01/9))/1_平方米"
        },
        iu: "平方米(㎡)",
        group: [{
            label: "公制",
            options: ["平方千米", "公顷", "公亩", "平方米", "平方分米", "平方厘米", "平方毫米"]
        }, {
            label: "英制",
            options: ["英亩", "平方英里", "平方码", "平方英尺", "平方英寸", "平方竿"]
        }, {
            label: "市制",
            options: ["顷", "亩", "分", "平方尺", "平方寸"]
        }]
    },
    volume: {
        name: '体积换算',
        alias: {
            "立方千米": "km³",
            "立方米": "m³",
            "立方分米": "dm³",
            "立方厘米": "cm³",
            "立方毫米": "mm³",
            "升": "l",
            "分升": "dl",
            "毫升": "ml",
            "厘升": "cl",
            "公石": "hl",
        },
        calc: {
            "立方千米": "(x*1)/1000000000_立方千米(km³)",
            "立方米": "(x*1)/1_立方米(m³)",
            "立方分米": "(x*1)*1000_立方分米(dm³)",
            "立方厘米": "(x*1)*1000000_立方厘米(cm³)",
            "立方毫米": "(x*1)*1000000000_立方毫米(mm³)",
            "升": "(x*1)*1000_升(l)",
            "分升": "(x*1)*10000_分升(dl)",
            "毫升": "(x*1)*1000000_毫升(ml)",
            "厘升": "(x*1)*100000_厘升(cl)",
            "公石": "(x*1)*10_公石(hl)",
            "立方英尺": "(x*1)/0.0283168_立方英尺(cu ft)",
            "立方英寸": "(x*1)/(0.0283168/1728)_立方英寸(cu in)",
            "立方码": "(x*1)/(0.0283168*27)_立方码(cu yd)",
            "亩英尺": "(x*1)/(43560*1728*0.016387064/1000)_亩英尺",
            "英制加仑": "(x*1)/0.00454609188_英制加仑(uk gal)",
            "美制加仑": "(x*1)/(231*0.016387064/1000)_美制加仑(us gal)",
            "微升": "(x*1)/0.000000001_微升(ul)",
            "英制液体盎司": "(x*1)/(0.000001*28.41)_英制液体盎司(oz)",
            "美制液体盎司": "(x*1)/(0.000001*29.57)_美制液体盎司(oz)"
        },
        init: {
            "立方千米": "(x*1000000000)/1_立方米",
            "立方米": "(x*1)/1_立方米",
            "立方分米": "(x/1000)/1_立方米",
            "立方厘米": "(x/1000000)/1_立方米",
            "立方毫米": "(x/1000000000)/1_立方米",
            "升": "(x/1000)/1_立方米",
            "分升": "(x/10000)/1_立方米",
            "毫升": "(x/1000000)/1_立方米",
            "厘升": "(x/100000)/1_立方米",
            "公石": "(x/10)/1_立方米",
            "立方英尺": "(x*0.0283168)/1_立方米",
            "立方英寸": "(x*(0.0283168/1728))/1_立方米",
            "立方码": "(x*(0.0283168*27))/1_立方米",
            "亩英尺": "(x*(43560*1728*0.016387064/1000))/1_立方米",
            "英制加仑": "(x*0.00454609188)/1_立方米",
            "美制加仑": "(x*(231*0.016387064/1000))/1_立方米",
            "微升": "(x/1000000000)/1_立方米",
            "英制液体盎司": "(x/1000000*28.41)/1_立方米",
            "美制液体盎司": "(x/1000000*29.57)/1_立方米"
        },
        iu: "立方米(m³)",
        group: [{
            label: "公制",
            options: ["立方千米", "立方米", "立方分米", "立方厘米", "立方毫米", "升", "分升", "毫升", "厘升", "公石", "微升"]
        }, {
            label: "英制",
            options: ["立方英尺", "立方英寸", "立方码", "亩英尺", "英制加仑", "美制加仑", "英制液体盎司", "美制液体盎司"]
        }]
    },
    weight: {
        name: '质量换算',
        alias: {
            "千克": "kg",
            "克": "g",
            "毫克": "mg",
            "微克": "μg",
            "吨": "t",
            "公担": "q",
            "磅": "lb",
            "盎司": "oz",
            "克拉": "ct",
            "格令": "gr",
            "长吨": "lt",
            "短吨": "st",
        },
        calc: {
            "千克": "(x*1)/1_千克(kg)",
            "克": "(x*1)*1000_克(g)",
            "毫克": "(x*1)*1000000_毫克(mg)",
            "微克": "(x*1)*1000000000_微克(μg)",
            "吨": "(x*1)/1000_吨(t)",
            "公担": "(x*1)/100_公担(q)",
            "磅": "(x*1)/0.45359237_磅(lb)",
            "盎司": "(x*1)/(0.45359237/16)_盎司(oz)",
            "克拉": "(x*1)/0.0002_克拉(ct)",
            "格令": "(x*1)/(0.45359237/7000)_格令(gr)",
            "长吨": "(x*1)/(0.45359237*2240)_长吨(lt)",
            "短吨": "(x*1)/(0.45359237*2000)_短吨(st)",
            "英担": "(x*1)/(0.45359237*112)_英担",
            "美担": "(x*1)/(0.45359237*100)_美担",
            "英石": "(x*1)/(0.45359237*14)_英石(st)",
            "打兰": "(x*1)/(0.45359237/256)_打兰(dr)",
            "担": "(x*1)/50_担",
            "斤": "(x*1)/0.5_斤",
            "两": "(x*1)/0.05_两",
            "钱": "(x*1)/0.005_钱",
            "分": "(x*1)/0.000002_分"
        },
        init: {
            "千克": "(x*1)/1_千克",
            "克": "(x/1000)/1_千克",
            "毫克": "(x/1000000)/1_千克",
            "微克": "(x/1000000000)/1_千克",
            "吨": "(x*1000)/1_千克",
            "公担": "(x*100)/1_千克",
            "磅": "(x*0.45359237)/1_千克",
            "盎司": "(x*(0.45359237/16))/1_千克",
            "克拉": "(x*0.0002)/1_千克",
            "格令": "(x*(0.45359237/7000))/1_千克",
            "长吨": "(x*(0.45359237*2240))/1_千克",
            "短吨": "(x*(0.45359237*2000))/1_千克",
            "英担": "(x*(0.45359237*112))/1_千克",
            "美担": "(x*(0.45359237*100))/1_千克",
            "英石": "(x*(0.45359237*14))/1_千克",
            "打兰": "(x*(0.45359237/256))/1_千克",
            "担": "(x*50)/1_千克",
            "斤": "(x*0.5)/1_千克",
            "两": "(x*0.05)/1_千克",
            "钱": "(x*0.005)/1_千克",
            "分": "(x*0.000002)/1_千克"
        },
        iu: "千克(kg)",
        group: [{
            label: "公制",
            options: ["千克", "克", "毫克", "微克", "吨", "公担", "克拉", "分"]
        }, {
            label: "英制",
            options: ["磅", "盎司", "克拉", "格令", "长吨", "短吨", "英担", "美担", "英石", "打兰"]
        }, {
            label: "市制",
            options: ["担", "斤", "两", "钱"]
        }]
    },
    temperature: {
        name: '温度换算',
        alias: {
            "摄氏度": "℃",
            "华氏度": "℉",
            "开氏度": "K",
            "兰氏度": "°R",
            "列氏度": "°Re"
        },
        calc: {
            "摄氏度": "(x-273.15)/1_摄氏度(℃)",
            "华氏度": "32+((x-273.15)*9/5)_华氏度(℉)",
            "开氏度": "(x-273.15)+273.15_开氏度(K)",
            "兰氏度": "((x-273.15)+273.15)*1.8_兰氏度(°R)",
            "列氏度": "(x-273.15)/1.25_列氏度(°Re)"
        },
        init: {
            "摄氏度": "(x*1)+273.15_开氏度",
            "华氏度": "(5*(x-32)/9)+273.15_开氏度",
            "开氏度": "(x-273.15)+273.15_开氏度",
            "兰氏度": "(x/1.8-273.15)+273.15_开氏度",
            "列氏度": "(x*1.25)+273.15_开氏度"
        },
        iu: "开氏度(K)",
        group: [{
            label: "",
            options: ["摄氏度", "华氏度", "开氏度", "兰氏度", "列氏度"]
        }]
    },
    pressure: {
        name: '压力换算',
        calc: {
            "帕斯卡": "(x*1)/1_帕斯卡(Pa)",
            "千帕": "(x*1)/1000_千帕(kpa)",
            "百帕": "(x*1)/100_百帕(hpa)",
            "标准大气压": "(x*1)/101325_标准大气压(atm)",
            "毫米汞柱": "(x*1)/(101325/760)_毫米汞柱(mmHg)",
            "英寸汞柱": "(x*1)/(101325/760*25.4)_英寸汞柱(in Hg)",
            "巴": "(x*1)/100000_巴(bar)",
            "毫巴": "(x*1)/100_毫巴(mbar)",
            "磅力/平方英尺": "(x*1)/(6894.757/144)_磅力/平方英尺(psf)",
            "磅力/平方英寸": "(x*1)/6894.757_磅力/平方英寸(psi)",
            "毫米水柱": "(x*1)/(1/0.101972)_毫米水柱",
            "公斤力/平方厘米": "(x*1)/98066.5_公斤力/平方厘米(kgf/cm²)",
            "公斤力/平方米": "(x*1)/9.80665_公斤力/平方米(kgf/㎡)",
            "兆帕": "(x*1)/1000000_兆帕(MPa)"
        },
        init: {
            "帕斯卡": "(x*1)/1_帕斯卡",
            "千帕": "(x*1000)/1_帕斯卡",
            "百帕": "(x*100)/1_帕斯卡",
            "标准大气压": "(x*101325)/1_帕斯卡",
            "毫米汞柱": "(x*(101325/760))/1_帕斯卡",
            "英寸汞柱": "(x*(101325/760*25.4))/1_帕斯卡",
            "巴": "(x*100000)/1_帕斯卡",
            "毫巴": "(x*100)/1_帕斯卡",
            "磅力/平方英尺": "(x*(6894.757/144))/1_帕斯卡",
            "磅力/平方英寸": "(x*6894.757)/1_帕斯卡",
            "毫米水柱": "(x*(1/0.101972))/1_帕斯卡",
            "公斤力/平方厘米": "(x*98066.5)/1_帕斯卡",
            "公斤力/平方米": "(x*9.80665)/1_帕斯卡",
            "兆帕": "(x*1000000)/1_兆帕"
        },
        iu: "帕斯卡(Pa)",
        group: [{
            label: "",
            options: ["帕斯卡", "兆帕", "千帕", "百帕", "标准大气压", "毫米汞柱", "英寸汞柱", "巴", "毫巴", "磅力/平方英尺", "磅力/平方英寸", "毫米水柱", "公斤力/平方厘米", "公斤力/平方米"]
        }]
    },
    power: {
        name: '功率换算',
        alias: {
            "瓦": "W",
            "千瓦": "kW"
        },
        calc: {
            "瓦": "(x*1)/1_瓦(W)",
            "千瓦": "(x*1)/1000_千瓦(kW)",
            "英制马力": "(x*1)/745.699872_英制马力(hp)",
            "米制马力": "(x*1)/(9.80665*75)_米制马力(ps)",
            "公斤·米/秒": "(x*1)/9.80665_公斤·米/秒(kg·m/s)",
            "千卡/秒": "(x*1)/4184.1004_千卡/秒(kcal/s)",
            "英热单位/秒": "(x*1)/1055.05585_英热单位/秒(Btu/s)",
            "英尺·磅/秒": "(x*1)/(745.699872/550)_英尺·磅/秒(ft·lb/s)",
            "焦耳/秒": "(x*1)/1_焦耳/秒(J/s)",
            "牛顿·米/秒": "(x*1)/1_牛顿·米/秒(N·m/s)"
        },
        init: {
            "瓦": "(x*1)/1_瓦",
            "千瓦": "(x*1000)/1_瓦",
            "英制马力": "(x*745.699872)/1_瓦",
            "米制马力": "(x*(9.80665*75))/1_瓦",
            "公斤·米/秒": "(x*9.80665)/1_瓦",
            "千卡/秒": "(x*4184.1004)/1_瓦",
            "英热单位/秒": "(x*1055.05585)/1_瓦",
            "英尺·磅/秒": "(x*(745.699872/550))/1_瓦",
            "焦耳/秒": "(x*1)/1_瓦",
            "牛顿·米/秒": "(x*1)/1_瓦"
        },
        iu: "瓦(W)",
        group: [{
            label: "",
            options: ["瓦", "千瓦", "英制马力", "米制马力", "公斤·米/秒", "千卡/秒", "英热单位/秒", "英尺·磅/秒", "焦耳/秒", "牛顿·米/秒"]
        }]
    },
    work: {
        name: '功/能/热换算',
        calc: {
            "焦耳": "(x*1)/1_焦耳(J)",
            "公斤·米": "(x*1)/9.80392157_公斤·米(kg·m)",
            "米制马力·时": "(x*1)/(9.80665*75*3600)_米制马力·时(ps·h)",
            "英制马力·时": "(x*1)/(745.699872*3600)_英制马力·时(hp·h)",
            "千瓦·时": "(x*1)/3600000_千瓦·时(kW·h)",
            "度": "(x*1)/3600000_度(kW·h)",
            "卡": "(x*1)/4.185851820846_卡(cal)",
            "千卡": "(x*1)/4185.851820846_千卡(kcal)",
            "英热单位": "(x*1)/1055.05585262_英热单位(btu)",
            "英尺·磅": "(x*1)/1.3557483731_英尺·磅(ft·lb)",
            "千焦": "(x*1)/1000_千焦(kJ)"
        },
        init: {
            "焦耳": "(x*1)/1_焦耳",
            "公斤·米": "(x*9.80392157)/1_焦耳",
            "米制马力·时": "(x*(9.80665*75*3600))/1_焦耳",
            "英制马力·时": "(x*(745.699872*3600))/1_焦耳",
            "千瓦·时": "(x*3600000)/1_焦耳",
            "度": "(x*3600000)/1_焦耳",
            "卡": "(x*4.185851820846)/1_焦耳",
            "千卡": "(x*4185.851820846)/1_焦耳",
            "英热单位": "(x*1055.05585262)/1_焦耳",
            "英尺·磅": "(x*1.3557483731)/1_焦耳",
            "千焦": "(x*1000)/1_焦耳"
        },
        iu: "焦耳(J)",
        group: [{
            label: "",
            options: ["焦耳", "公斤·米", "米制马力·时", "英制马力·时", "千瓦·时", "度", "卡", "千卡", "英热单位", "英尺·磅", "千焦"]
        }]
    },
    density: {
        name: '密度换算',
        calc: {
            "千克/立方厘米": "(x*1)/(Math.pow(10,6))_千克/立方厘米(kg/cm³)",
            "千克/立方分米": "(x*1)/1000_千克/立方分米(kg/dm³)",
            "千克/立方米": "(x*1)_千克/立方米(kg/m³)",
            "克/立方厘米": "(x*1)/1000_克/立方厘米(g/cm³)",
            "克/立方分米": "(x*1)_克/立方分米(g/dm³)",
            "克/立方米": "(x*1000)_克/立方米(g/m³)"
        },
        init: {
            "千克/立方厘米": "(x*1000000)_千克/立方米",
            "千克/立方分米": "(x*1000)_千克/立方米",
            "千克/立方米": "(x*1)_千克/立方米",
            "克/立方厘米": "(x*1000)_千克/立方米",
            "克/立方分米": "(x*1)_千克/立方米",
            "克/立方米": "(x*1)/1000_千克/立方米"
        },
        iu: "千克/立方米(kg/m³)",
        group: [{
            label: "",
            options: ["千克/立方厘米", "千克/立方分米", "千克/立方米", "克/立方厘米", "克/立方分米", "克/立方米"]
        }]
    },
    strength: {
        name: '力换算',
        calc: {
            "牛": "(x*1)_牛(N)",
            "千牛": "(x*1)/1000_千牛(kN)",
            "千克力": "(x*101.971621)/1000_千克力(kgf)",
            "克力": "(x*101.971621)_克力(gf)",
            "公吨力": "(x*101.971621)/(Math.pow(10,6))_公吨力(tf)",
            "磅力": "(x*224.808943)/1000_磅力_(lbf)",
            "千磅力": "(x*224.808943)/(Math.pow(10,6))_千磅力(kip)",
            "达因": "(x*100000)/1_达因(dyn)"
        },
        init: {
            "牛": "(x*1)_牛",
            "千牛": "(x*1000)_牛",
            "千克力": "(x*9.806650)_牛",
            "克力": "(x*9.806650)/1000_牛",
            "公吨力": "(x*9806.650000)_牛",
            "磅力": "(x*4.448222)_牛",
            "千磅力": "(x*4448.221615)_牛",
            "达因": "(x*1)/100000_牛"
        },
        iu: "牛(N)",
        group: [{
            label: "",
            options: ["牛", "千牛", "千克力", "克力", "公吨力", "磅力", "千磅力", "达因"]
        }]
    },
    time: {
        name: '时间换算',
        alias: {
            "年": ["y",'yr'],
            "周": "week",
            "天": "d",
            "时": "h",
            "分": "min",
            "秒": "s",
            "毫秒": "ms",
            "微秒": "μs",
            "纳秒": "ns"
        },
        calc: {
            "年": "(x*1)/60/24/365_年(yr)",
            "周": "(x*1)/60/24/7_周(week)",
            "天": "(x*1)/60/24_天(d)",
            "时": "(x*1)/60_时(h)",
            "分": "(x*1)_分(min)",
            "秒": "(x*1)*60_秒(s)",
            "毫秒": "(x*1)*60*1000_毫秒(ms)",
            "微秒": "(x*1)*60*1000000_微秒(μs)",
            "纳秒": "(x*1)*60*1000000000_纳秒(ns)"
        },
        init: {
            "年": "(x*24*60*365)_分",
            "周": "(x*24*60*7)_分",
            "天": "(x*24*60)_分",
            "时": "(x*1)*60_分",
            "分": "(x*1)_分",
            "秒": "(x*1)/60_分",
            "毫秒": "(x*1)/60/1000_分",
            "微秒": "(x*1)/60/1000000_分",
            "纳秒": "(x*1)/60/1000000000_分"
        },
        iu: "秒(s)",
        group: [{
            label: "",
            options: ["年", "周", "天", "时", "分", "秒", "毫秒", "微秒", "纳秒"]
        }],
        special: {
            "时-分": "(x*60)_分_(min)"
        }
    },
    speed: {
        name: '速度换算',
        calc: {
            "米/秒": "(x*1)_米/秒(m/s)",
            "千米/秒": "(x*1)/1000_千米/秒(km/s)",
            "千米/时": "(x*3.600000)_千米/时(km/h)",
            "光速": "(x*3.335641)/(Math.pow(10,9))_光速(c)",
            "马赫": "(x*2.938584)/1000_马赫(mach)",
            "英里/时": "(x*2.236936)_英里/时(mile/h)",
            "英寸/秒": "(x*39.370079)_英寸/秒(in/s)"
        },
        init: {
            "米/秒": "(x*1)_米/秒",
            "千米/秒": "(x*1000)_米/秒",
            "千米/时": "(x*277.777778)/1000_米/秒",
            "光速": "(x*299792458)_米/秒",
            "马赫": "(x*340.300000)_米/秒",
            "英里/时": "(x*447.040000)/1000_米/秒",
            "英寸/秒": "(x*25.400000)/1000_米/秒"
        },
        iu: "米/秒(m/s)",
        group: [{
            label: "",
            options: ["米/秒", "千米/秒", "千米/时", "光速", "马赫", "英里/时", "英寸/秒"]
        }]
    },
    "byte": {
        name: '存储换算',
        alias: {
            "比特": "bit",
            "字节": "b",
            "千字节": "kb",
            "兆字节": "mb",
            "千兆字节": "gb",
            "太字节": "tb",
            "拍字节": "pb",
            "艾字节": "eb"
        },
        calc: {
            "比特": "(x*8)_比特(bit)",
            "字节": "(x*1)_字节(b)",
            "千字节": "(x*1)/(Math.pow(2,10))_千字节(kb)",
            "兆字节": "(x*1)/(Math.pow(2,20))_兆字节(mb)",
            "千兆字节": "(x*1)/(Math.pow(2,30))_千兆字节(gb)",
            "太字节": "(x*1)/(Math.pow(2,40))_太字节(tb)",
            "拍字节": "(x*1)/(Math.pow(2,50))_拍字节(pb)",
            "艾字节": "(x*1)/(Math.pow(2,60))_艾字节(eb)"
        },
        init: {
            "比特": "(x*1)/8_字节",
            "字节": "(x*1)_字节",
            "千字节": "(x*1024)_字节",
            "兆字节": "(x*Math.pow(2,20))_字节",
            "千兆字节": "(x*Math.pow(2,30))_字节",
            "太字节": "(x*Math.pow(2,40))_字节",
            "拍字节": "(x*Math.pow(2,50))_字节",
            "艾字节": "(x*Math.pow(2,60))_字节"
        },
        iu: "字节(b)",
        group: [{
            label: "",
            options: ["比特", "字节", "千字节", "兆字节", "千兆字节", "太字节", "拍字节", "艾字节"]
        }]
    },
    angle: {
        name: '角度换算',
        calc: {
            "圆周": "(x*2.777778)/1000_圆周",
            "直角": "(x*11.111111)/1000_直角",
            "百分度": "(x*1.111111)_百分度(gon)",
            "度": "(x*1)_度(°)",
            "分": "(x*60)_分(′)",
            "秒": "(x*3600)_秒",
            "弧度": "(x*17.453293)/1000_弧度(rad)",
            "毫弧度": "(x*17.453293)_毫弧度(mrad)"
        },
        init: {
            "圆周": "(x*360)_度",
            "直角": "(x*90)_度",
            "百分度": "(x*900)/1000_度",
            "度": "(x*1)_度",
            "分": "(x*16.666667)/1000_度",
            "秒": "(x*0.2777778)/1000_度",
            "弧度": "(x*57.295780)_度",
            "毫弧度": "(x*57.295780)/1000_度"
        },
        iu: "角度(°)",
        group: [{
            label: "角度制",
            options: ["圆周", "直角", "百分度", "度", "分", "秒"]
        }, {
            label: "弧度制",
            options: ["弧度", "毫弧度"]
        }]
    },
    cny: {
        name: '人民币换算',
        calc: {
            "元": "(x*1)/1_元",
            "角": "(x*1)*10_角",
            "分": "(x*1)*10*10_分"
        },
        init: {
            "元": "(x*1)/1_元",
            "角": "(x*1)/10_元",
            "分": "(x*1)/100_元"
        },
        iu: "元",
        group: [{
            label: "",
            options: ["元", "角", "分"]
        }]
    },
    hex: {
        name: '进制转换',
        calc: {
            "二进制": "parseInt(x).toString(2)_二进制",
            "八进制": "parseInt(x).toString(8)_八进制",
            "十进制": "parseInt(x).toString(10)_十进制",
            "十六进制": "parseInt(x).toString(16)_十六进制"
        },
        init: {
            "二进制": "parseInt(x,2)_二进制",
            "八进制": "parseInt(x,8)_八进制",
            "十进制": "x_十进制",
            "十六进制": "parseInt(x,16)_十六进制"
        },
        alias: {
            "二进制": ['bin'],
            "八进制": ['oct'],
            "十进制": ['dec'],
            "十六进制": ['hex']
        },
        iu: "二进制",
        group: []
    },
    exchange: {
        name: '货币汇率换算',
        calc: {
            "人民币": exchange,
            "美元": exchange,
            "欧元": exchange,
            "英镑": exchange,
            "日元": exchange,
            "韩元": exchange,
            "卢布": exchange,
            "黄金": exchange,
            "白银": exchange,
            "澳元": exchange,
            "加元": exchange,
            "澳门币": exchange,
            "台币": exchange,
            "港币": exchange,
            "新币": exchange,
            "越币": exchange,
            "土币": exchange,
            "泰铢": exchange,
        },
        init: {},
        alias: {}
    },
    netSpeed:{
        name:"网速换算",
        calc:{
            bps:"x_bps",
            Kbps:"x/1024_Kbps",
            Mbps:"x/1024**2_Mbps",
            Gbps:"x/1024**3_Gbps",
            "Byte/s":"x/8_Byte/s",
            "KByte/s": "x/8/1024_KByte/s",
            "MByte/s": "x/8/1024**2_MByte/s",
            "GByte/s": "x/8/1024**3_GByte/s",
        },
        init:{
            bps:"x_bps",
            Kbps:"x*1024_Kbps",
            Mbps:"x*1024**2_Mbps",
            Gbps:"x*1024**3_Gbps",
            "Byte/s":"x*8_Byte/s",
            "KByte/s": "x*8*1024_KByte/s",
            "MByte/s": "x*8*1024**2_MByte/s",
            "GByte/s": "x*8*1024**3_GByte/s",
        }
    }
};

async function calc(name, value, srcUnit, toUnit = null) {
    var l = [], e = data[name];
    // 如果相同的单位  直接返回值
    if (srcUnit === toUnit){
        l.push({
            value: value,
            unit: toUnit
        });
        return l;
    }
    var initCalcValue = e.init[srcUnit];
    if (!initCalcValue) initCalcValue = "" + value;
    var initValue = await _calc2(initCalcValue, value , srcUnit , toUnit);
    if ("全部" === toUnit || !toUnit) {
        for (let unit in e.calc)
            if (unit !== srcUnit) {
                let unitValue = await _calc2(e.calc[unit], initValue , srcUnit, unit);
                l.push({
                    value: toValue(unitValue),
                    unit: e.calc[unit] instanceof Function ? unit :  e.calc[unit].split("_")[1]
                })
            }
    } else {
        let unitValue = await _calc2(e.calc[toUnit], initValue , srcUnit,  toUnit);
        l.push({
            value: toValue(unitValue),
            unit: toUnit
        })
    }
    return l
}

async function _calc2(calcValue, value, srcUnit, toUnit) {
    if (calcValue instanceof Function) {
        return await calcValue(value, srcUnit, toUnit);
    }
    calcValue = getCalc(value, calcValue)[0];
    return new Function("return " + calcValue)()
}

/**
 * 计算值
 * @param x
 * @return {*}
 * @private
 */
function _calc(x) {
    if (x instanceof Function) return x();
    return new Function("return " + x)()
}

function t(x, _) {
    if (typeof x === 'string') return x;
    var t = x.toExponential(_);
    return (t + "").match(new RegExp(".0{" + _ + "}e")) ? x.toExponential(0) : t
}

function toValue(x) {
    var _, a, i, p = x + "", e = !1;
    if (p.indexOf(".") > -1) {
        var c = p.match(/\.\d+e[+-](\d+)$/);
        e = c && c[1] ? 1 * c[1] < o - 1 ? !0 : !1 : !0
    }
    return e ? x > -1 && 1 > x && 0 != x ? x = Math.abs(x) < 1e-5 ? t(x, l) : 1 * x.toFixed(n) : (_ = p.split("."),
        a = _[0],
        i = _[1],
        p.length > o ? x = a.length >= o ? t(x, l) : a.length < n - 1 ? 1 * x.toFixed(n) : 1 * x.toFixed(o - a.length - 1) : i.length > n && (x = 1 * x.toFixed(n))) : p.length > o && (x = t(x, l)),
    x + ""
}

/**
 * 获取计算
 * @param value
 * @param calcStr
 * @return array ["(1*1000)/1", "米"]
 */
function getCalc(value, calcStr) {
    return calcStr.replace("x", typeof value === 'number' ? value : `'${value}'`).split("_")
}



export default {
    calc: calc,
    calcData: data
}
