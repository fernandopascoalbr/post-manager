const {authSecret} = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app =>{
    const signin = async (req, res) =>{
        if(!req.body.email || !req.body.password) return res.status(400).send("Informe o usuário ou senha.")
        const user = await app.db('users').where({email: req.body.email})
            .first()

        if(!user || user.deletedAt) return res.status(400).send("Usuário não encontrado. ")

        const isMath = bcrypt.compareSync(req.body.password, user.password)
        if(!isMath) return res.status(401).send("Email/Senha invalidos. ")

        const now = Math.floor(Date.now() / 1000)//1000 para obter resultado em segundos
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now,
            exp: now + (60*60*24*3)
            //exp: now + 10
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) =>{
        const userData = req.body || null
        try{ 
            if(userData){
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()){
                    return res.send(true)
                }
            }
        }catch(msg){
            //problema com o token
        }

        res.send(false)
    }

    return {signin, validateToken}
}