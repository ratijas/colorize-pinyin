/**
 * colorize-pinyin.js
 */

(function (global){

/**
 * colorizeDOM(rootNode, nodeFilter, pinyinWrapperClass, tonesClasses)
 * 
 * modify given DOM in place.
 * detect and colorize pinyin in text nodes of *rootNode* and its
 * child nodes ignoring nodes for which *nodeFilter* returns false.
 * text nodes will be replaced with <span> wrapper whose class
 * attribute is *pinyinWrapperClass*.
 * wrapper will contain only text nodes and <span>s with one of
 * *tonesClasses* accordingly to the tone of containing pinyin.
 * 
 * parameters:
 *     rootNode -- HTMLElement.
 *     nodeFilter -- callable.
 *         parameters:
 *             node -- HTMLElement.
 *         return value:
 *             `true` to allow function to look up for pinyin inside
 *             node itself or its child nodes, otherwise `false`.
 *             its useful to deny colorizing of <a> or other elements
 *             that should have their own colors by design.
 *     pinyinWrapperClass -- class for wrapper <span>
 *     tonesClasses -- 5-array of class names for <span> inside
 *         wrapper.  element with index [0] will be used for zero
 *         tone, [1] for first and so on.
 * 
 * return value:
 *     undefined
 */
function colorizeDOM(rootNode, nodeFilter, pinyinWrapperClass, tonesClasses) {
    if (!nodeFilter)
        nodeFilter = function(node){return 'a' !== node.tagName.toLowerCase()};

    for (var i = 0; i < rootNode.childNodes.length; i++)
    {
        var child = rootNode.childNodes[i];

        if (child.nodeType === 1 /* ELEMENT_NODE */ &&
            nodeFilter(child))
        {
            colorizeDOM(child, nodeFilter, pinyinWrapperClass, tonesClasses);
        }
        else if (child.nodeType === 3 /*TEXT_NODE*/ &&
                 ! child.textContent.match(/^\s*$/))
        {
            var elem = colorizedHTMLElementFromString(child.textContent, pinyinWrapperClass, tonesClasses);
            if (elem) {
                rootNode.insertBefore(elem, child);
                rootNode.removeChild(child);
            }
        }
    }
}
global.colorizeDOM = colorizeDOM;


/**
 * colorizedHTMLElementFromString(string[, pinyinWrapperClass][, tonesClasses]) --> HTMLElement | undefined
 * 
 * returns an ``HTMLElement`` or undefined.
 */
function colorizedHTMLElementFromString(string, pinyinWrapperClass, tonesClasses) {
    var ranges = rangesOfPinyinInString(string);
    if (!ranges.length)
        return;
    if (!pinyinWrapperClass)
        pinyinWrapperClass = 'pinYinWrapper';
    if (!tonesClasses)
        tonesClasses = ['t0', 't1', 't2', 't3', 't4'];

    var allTonesAreZero = true;
    var words = [],
        tones = [];
    for (i in ranges) {
        var range = ranges[i],
            word = string.slice(range[0], range[0] + range[1]),
            tone = determineTone(word);
        words[i] = word;
        tones[i] = tone;
        if (tone !== 0) {allTonesAreZero = false};
    }
    /* probably it's not a pinyin, but an english word */
    if (allTonesAreZero) {return};

    var wrapper = document.createElement("span");
    wrapper.classList.add(pinyinWrapperClass);
    wrapper.textContent = string.slice(0, ranges[0][0]);

    for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i],
            word = words[i],
            span = document.createElement("span");
        span.classList.add(tonesClasses[tones[i]]);
        span.textContent = word;
        wrapper.appendChild(span);
        if (ranges.length > i + 1)
            wrapper.appendChild(
                document.createTextNode(
                    string.slice(range[0] + range[1], ranges[i + 1][0])))
    }
    wrapper.appendChild(
        document.createTextNode(
            string.slice(range[0] + range[1])))
    return wrapper;
}
global.colorizedHTMLElementFromString = colorizedHTMLElementFromString;


// ---- static vars
var _diacritics = [
    [/[āáǎăà]/g, 'a'],
    [/[ēéěè]/g, 'e'],
    [/[ōóǒò]/g, 'o'],
    [/[ūúǔŭùǖǘǚǜ]/g, 'u'],
    [/[īíǐì]/g, 'i']
];


/**
 * lowercaseStringByRemovingPinyinTones(string) --> string
 *
 *  simplify / plainize chinese pinyin by converting it to lower case and
 *  removing diacritics from letters 'a', 'e', 'o', 'u', i'.
 */
function lowercaseStringByRemovingPinyinTones(string) {
    string = string.toLowerCase();
    for (var i = 0; i < _diacritics.length; i++) {
        var pair = _diacritics[i];

        string = string.replace(pair[0], pair[1]);
    };
    return string;
}
global.lowercaseStringByRemovingPinyinTones = lowercaseStringByRemovingPinyinTones;


// ---- static vars
var _t1 = "āēūǖīō";
var _t2 = "áéúǘíó";
var _t3 = "ǎăěǔŭǚǐǒ";
var _t4 = "àèùǜìò";


/**
 * determineTone(string) --> {0..4}
 *
 * detect tone of given pinyin word.
 * return value:
 *     int from 0 up to 4, where 0 means that tone undetermined.
 *
 */
function determineTone(pinyin) {
    pinyin = pinyin.toLowerCase();
    var pinyinLen = pinyin.length;
    for (var i = 0; i < pinyinLen; i++) {
        var letter = pinyin[i];

        if (~_t1.indexOf(letter))
            return 1;
        if (~_t2.indexOf(letter))
            return 2;
        if (~_t3.indexOf(letter))
            return 3;
        if (~_t4.indexOf(letter))
            return 4;
    };
    return 0;
}
global.determineTone = determineTone;


// ---- static vars
var PINYIN_LIST_BY_LEN = [
    [6, 'zhuang,shuang,chuang'.split(',')],
    [5, 'zhuan,zhuai,zhong,zheng,zhang,xiong,xiang,shuan,shuai,sheng,shang,qiong,qiang,niang,liang,kuang,jiong,jiang,huang,guang,chuan,chuai,chong,cheng,chang'.split(',')],
    [4, 'zuan,zong,zhuo,zhun,zhui,zhua,zhou,zhen,zhei,zhao,zhan,zhai,zeng,zang,yuan,yong,ying,yang,xuan,xing,xiao,xian,weng,wang,tuan,tong,ting,tiao,tian,teng,tang,suan,song,shuo,shun,shui,shua,shou,shen,shei,shao,shan,shai,seng,sang,ruan,rong,reng,rang,quan,qing,qiao,qian,ping,piao,pian,peng,pang,nüe,nuan,nong,ning,niao,nian,neng,nang,ming,miao,mian,meng,mang,lüe,luan,long,ling,liao,lian,leng,lang,kuan,kuai,kong,keng,kang,juan,jing,jiao,jian,huan,huai,hong,heng,hang,guan,guai,gong,geng,gang,feng,fang,duan,dong,ding,diao,dian,deng,dang,cuan,cong,chuo,chun,chui,chua,chou,chen,chao,chan,chai,ceng,cang,bing,biao,bian,beng,bang'.split(',')],
    [3, 'zuo,zun,zui,zou,zhu,zhi,zhe,zha,zen,zei,zao,zan,zai,yun,yue,you,yin,yao,yan,xun,xue,xiu,xin,xie,xia,wen,wei,wan,wai,tuo,tun,tui,tou,tie,tao,tan,tai,suo,sun,sui,sou,shu,shi,she,sha,sen,sei,sao,san,sai,ruo,run,rui,rua,rou,ren,rao,ran,qun,que,qiu,qin,qie,qia,pou,pin,pie,pen,pei,pao,pan,pai,nü,nuo,nou,niu,nin,nie,nen,nei,nao,nan,nai,mou,miu,min,mie,men,mei,mao,man,mai,lü,luo,lun,lou,liu,lin,lie,lia,lei,lao,lan,lai,kuo,kun,kui,kua,kou,ken,kei,kao,kan,kai,jun,jue,jiu,jin,jie,jia,huo,hun,hui,hua,hou,hen,hei,hao,han,hai,guo,gun,gui,gua,gou,gen,gei,gao,gan,gai,fou,fen,fei,fan,duo,dun,dui,dou,diu,die,dia,den,dei,dao,dan,dai,cuo,cun,cui,cou,chu,chi,che,cha,cen,cao,can,cai,bin,bie,ben,bei,bao,ban,bai,ang'.split(',')],
    [2, 'zu,zi,ze,za,yu,yo,yi,ye,ya,xu,xi,wu,wo,wa,tu,ti,te,ta,su,si,se,sa,ru,ri,re,qu,qi,pu,po,pi,pa,ou,nu,ni,ng,ne,na,mu,mo,mi,me,ma,lu,li,le,la,ku,ke,ka,ju,ji,hu,he,ha,gu,ge,ga,fu,fo,fa,er,en,ei,du,di,de,da,cu,ci,ce,ca,bu,bo,bi,ba,ao,an,ai'.split(',')],
    [1, 'o,n,m,e,a,r'.split(',')],
];


/**
 * rangesOfPinyinInString(string) --> list<Range>
 * 
 * searches for pinyin in given string *s*.
 *
 * return value:
 *     list of ranges of pinyin,
 *     where ``range`` is 2-item array of (location, length).
 *     list can be empty.
 */
function rangesOfPinyinInString(string) {
    var result = [];

    // the trick of replacing 'v' is that 'v' does not exists in pinyin,
    // but still returns *True* on str.islower()

    var plain_s = lowercaseStringByRemovingPinyinTones(string).replace('v', ' ');
    var plain_s_len = plain_s.length;

    var char_p = 0; // scan through whole string, skipping len(found) chars.

    while (char_p < plain_s_len) {
        // scan for next nearest beginning of pinyin word,
        // e.g for small(1) latin char [a-z].
        // (1) small because after ``lowercase_...`` no caps left.
        if ( plain_s[char_p] < 'a' || plain_s[char_p] > 'z' ) {
            char_p += 1;
            continue;
        }

        // now char_p pointing at lowercase letter

        // try to match string to pinyin from the list.  remember that list is
        // sorted by length.
        var found = false;
        for (var i = 0; i < PINYIN_LIST_BY_LEN.length; i++)
        {
            var word_len = PINYIN_LIST_BY_LEN[i][0],
                words = PINYIN_LIST_BY_LEN[i][1],
                word = plain_s.slice(char_p, char_p + word_len);
            if (~words.indexOf(word)) {
                // rule of apostrophe in pinyin:
                //   "'" must be before 'a', 'e' and 'o'.
                //
                // if next letter exactly 'a', 'e' or 'o',
                //   do a rollback by one letter and check, if such word exists.
                //
                // remember that a pinyin never begins with 'i' or 'u',
                //   and 'v' already replaced with space before the loop.
                var after_word = char_p + word_len;
                if (word_len > 1 &&
                    after_word + 1 < plain_s_len &&
                    ~'aoeiu'.indexOf(plain_s[after_word]))
                {
                    var shorten_word = word.slice(0, -1);
                    if (~PINYIN_LIST_BY_LEN[7 - word_len][1].indexOf(shorten_word))
                    {
                        if (~'iu'.indexOf(plain_s[after_word])) {
                            // 100% rollback
                            word = shorten_word;
                            word_len = word.length;
                        } else {
                            // 'aoe'.  try, maybe?
                            for (var j = 0; j < PINYIN_LIST_BY_LEN.length; j++)
                            {
                                var wl = PINYIN_LIST_BY_LEN[j][0],
                                    ws = PINYIN_LIST_BY_LEN[j][1],
                                    next_w = plain_s.slice(after_word - 1, after_word - 1 + wl);
                                if (~ws.indexOf(next_w)) {
                                    // OK.  there is a next pinyin that starts with last letter of current pinyin.
                                    word = shorten_word;
                                    word_len = word.length;
                                    found = true;
                                    break;
                                }
                            }
                        }
                    }
                    // else:
                        // then our rollback failed,
                        // there should be an error in pinyin,
                        // but we'll try hard to save the situation.
                        // let's leave non-shorten word and be happy
                }
                // *word* keeps the word we found.
                found = true;
                break;
            }
        }
        if (found) {
            result.push([char_p, word_len]);
            char_p += word_len;
        } else {
            // loop exited normally, means word not matches pinyin
            // but the letter is latin.  so we need to skip all subsequence
            // latins.  and spaces also.
            while (char_p < plain_s_len && ! /\s/.test(plain_s[char_p]))
                char_p += 1;
            while (char_p < plain_s_len && /\s/.test(plain_s[char_p]))
                char_p += 1;
        }
    }
    return result;
}
global.rangesOfPinyinInString = rangesOfPinyinInString;

})(window);