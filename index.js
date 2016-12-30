


const fs=require('fs');
const stat=fs.stat;
const path=require('path');
const zlib=require('zlib');
const gzip=zlib.createGzip();

const root='/\\202.11.4.65\\yf1\\StarRiver';


//创建多级目录  递归与回调
var mkdirs = function(dirpath, callback) {
    fs.exists(dirpath, function(exists) {
        if(exists) {
                callback();
        } else {
                //尝试创建父目录，然后再创建当前目录
                mkdirs(path.dirname(dirpath), function(){
                        fs.mkdir(dirpath,callback);
                 });
        }
    })
};


var unzip=function (name,version,dst,cb) {
    //传入的参数分别为软件名字，版本和解压到的目录
    var src=path.join(root,name,version);
    fs.readdir(src,(err,paths)=>{
        if(err){
            console.log('目录不存在或输入不正确');
            throw err;
        }
        paths.forEach(function(_path){
            var _src=path.join(src,_path);
            stat(_src,(err,stats)=>{
                if(err){
                    throw err;
                }
                if(stats.isFile()&&path.extname(_src)==='.gz'){
                    _dst=path.join(dst,name,version);
                    fs.access(_dst,fs.F_OK,(non)=>{
                        if(non){
                            mkdirs(_dst,()=>{});
                        }
                    });
                    console.log('正在解压中...');
                    console.log(_src);
                    fs.createReadStream(_src)
                        .pipe(zlib.createGunzip())
                        .pipe(fs.createWriteStream(_dst));
                    // cb(_src,_dst);
                    cb();
                }
            })
        })
    })
}
unzip('StarRiverDB','v1.1.0','F:\\StarRiver',()=>{
    console.log('解压完成')
});