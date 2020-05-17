var UserconfModel = require('../model/Userconf');

async function a() {
    // let arr = [96,101,110,113,121]
    // for(let i=64;i<91;i++){
    //     arr.push(i)
    // }
    for(let code of arr){
        console.log(code,'-----------------------code')
        await UserconfModel.remove({code:code})
    }
    console.log('end')
}
a()