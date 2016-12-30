
const fs=require('fs');
const stat=fs.stat;
const path=require('path');
const Unzip=require('unzip');//需要引入unzip
const mkdirp=require('mkdirp');//需要引入mkdirp
const exec=require('child_process').exec;

//cmdStr为写入iscc.bat文件的cmd命令，作用是进入iscc所在目录并运行命令将解压文件编译成.exe文件
const cmdStr='cd H:/Inno Setup 5 & H: & iscc F:/InnoSetup/smart-light.iss';

//root为服务器端资源地址
const root='//202.11.4.65/yf1/StarRiver';



var iscc=function(cb){
    fs.writeFile('iscc.bat',cmdStr,function(err){
        if(err){
            throw err;
        }

        exec('call iscc.bat',(err,stdout,stderr)=>{
            if(err){
                 throw err;
            }
            // console.log(stdout);
            cb(stderr,stdout);
        })
    })
}

var unzip=function (name,version,dst,cb) {
    //传入的参数分别为软件名字，版本和解压到的目录
    var src=path.join(root,name,version);
    fs.readdir(src,(err,paths)=>{
        if(err){
            throw err;
        }
        paths.forEach(function(_path){
            var _src=path.join(src,_path);
            stat(_src,(err,stats)=>{
                if(err){
                    throw err;
                }
                if(stats.isFile()&&path.extname(_src)==='.zip'){
                    fs.access(dst,fs.F_OK,(non)=>{
                        if(non){
                            mkdirp(dst,(err)=>{
                                if(err){
                                    throw err;
                                }
                            });
                        }
                    });
                    var extract=Unzip.Extract({path:dst});
                    console.log(_src+'  正在解压中...');
                    console.time(_src);
                    fs.createReadStream(_src).pipe(extract);
                    //解压异常处理
                    extract.on('error',(err)=>{
                        if(err){
                            throw err;
                        }
                    })
                    extract.on('finish',()=>{
                        console.timeEnd(_src);
                        console.log('已解压到  '+dst);
                        console.log('准备运行iscc 命令')
                        //执行cmd命令将解压文件打包成.exe文件
                        iscc(cb);
                    })
                }
            })
        })
    })
}

//传入的参数分别为软件名字，版本号和解压到的目录,测试时根据本机上的目录修改参数
unzip('starRiverServer','v2.0.0','F:\\InnoSetup\\source',(err,result)=>{
    if(err){
        console.log('编译出错');
        throw err;
    }
    console.log(result);
    console.log('命令执行成功');
});


module.exports=unzip;