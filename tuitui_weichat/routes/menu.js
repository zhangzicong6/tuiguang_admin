var express = require('express');
var router = express.Router();
var MenuModel = require('../model/Menu');
var WechatUtil = require('../util/wechat_get.js');

router.get('/', async(req, res, next) => {
    let doc = await MenuModel.find();
    res.send({data: doc})
});

router.post('/create', async(req, res, next) => {
    let data = {
        title: req.body.title,
        codes: req.body.codes,
        values: req.body.values,
        individual: req.body.individual,
        sex: req.body.sex
    };
    let doc = await MenuModel.create(data);

    if (doc) {
        for (let code of doc.codes) {
            if(doc.individual) {
                createIndividualMenu(code, doc.values, doc.sex, doc._id, null)
            } else {
                createMenu(code, doc.values)
            }
        }
        res.send({success: '创建成功', data: doc})
    } else {
        res.send({err: '创建失败'})
    }
});

router.post('/update', async(req, res, next) => {
    let id = req.body.id;
    let data = {
        title: req.body.title,
        codes: req.body.codes,
        values: req.body.values,
        individual: req.body.individual,
        sex: req.body.sex
    };
    let doc = await MenuModel.findByIdAndUpdate(id, data, {new: true});
    if (doc) {
        for (let code of doc.codes) {
            if(data.individual) {
                createIndividualMenu(code, doc.values, doc.sex, doc._id, doc.menuid)
            } else {
                createMenu(code, doc.values)
            }
        }
        res.send({success: '修改成功', data: doc})
    } else {
        res.send({err: '修改失败'})
    }
});

router.get('/del', async(req, res, next) => {
    let id = req.query.id;
    var doc = await MenuModel.findByIdAndRemove(id);
    for (let code of doc.codes) {
        if(doc.individual) {
            console.log('--------------------删除个性化菜单1---------------------------')
            removeIndividualMenu(code, doc.menuid)
        } else {
            createMenu(code, {button: []})
        }
    }
    res.send({success: '删除成功', data: doc})
});


// 创建通用菜单
async function createMenu(code, menu) {
    var menu = {"button": menu};
    console.log('menu', menu);
    var api = await WechatUtil.getClient(code);
    if (menu.button.length == 0) {
        api.removeMenu(function (err, res) {
            console.log(res);
            api.getMenu(function (err, res_m) {
                console.log(JSON.stringify(res_m));
            });
        });
        return
    } else {
        api.removeMenu(function (err, res) {
            if (err) {
                console.log('--------removeMenu-----err-----')
                console.log(err)
                console.log(res)
            }
            api.createMenu(menu, function (err, res) {
                if (err) {
                    console.log('--------createMenu-----err-----')
                    console.log(err)
                    console.log(res)
                }
                api.getMenu(function (err, res_m) {
                    console.log(err)
                    console.log(JSON.stringify(res_m));
                });
            });
        });
        return
    }
};

// 创建个性化菜单
async function createIndividualMenu(code, menu, sex, id, menuid) {
    console.log('menu', menu, 'menu')
    let individaulMenu = {
        "button": menu,
        "matchrule": {
            "sex": sex
        }
    };
    console.log('individaulMenu', individaulMenu);
    console.log('code', code);
    var api = await WechatUtil.getClient(code);
    if(menuid) {
        api.removeCustomMenu(menuid, function (err, res) {
            console.log(err)
            console.log(res)
        })
    }
    api.createCustomMenu(individaulMenu, async function (err, res) {
        if (err) {
            console.log('--------createCustomMenu-----err-----')
            console.log(err)
            console.log(res)
        }
        let result = await MenuModel.findByIdAndUpdate(id, {menuid: res.menuid}, {new: true});
        if(result) {
            api.getMenu(function (error, res_m) {
                console.log(error)
                console.log(res_m);
            });
        }
    });
};

async function removeIndividualMenu(code, menuid) {
    console.log('--------------------删除个性化菜单2---------------------------')
    console.log('code', code)
    console.log('menuid', menuid)
    var api = await WechatUtil.getClient(code);
    if(menuid) {
        api.removeCustomMenu(menuid, function (err, res) {
            console.log(err)
            console.log(res)
        })
    }
}

module.exports = router;
