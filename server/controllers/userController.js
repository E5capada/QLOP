const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket, Order, Favorite, BasketProduct, FavoriteProduct} = require('../models/models')

const generateJwt = (id, email, role) => {
     return jwt.sign(
         {id, email, role},
         process.env.SECRET_KEY,
         {expiresIn: '24h'}
     )
 }

class UserController {
    async registration(req, res, next) {
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
           return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword})
        const basket = await Basket.create({userId: user.id})
        const order = await Order.create({userId: user.id})
        const favorite = await Favorite.create({userId: user.id})

        //const token = jwt.sign({id: user.id, email, role}, process.env.SECRET_KEY, {expiresIn: '24h'})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
         if (!user) {
             return next(ApiError.internal('Пользователь не найден'))
         }
         let comparePassword = bcrypt.compareSync(password, user.password)
         if (!comparePassword) {
             return next(ApiError.internal('Указан неверный пароль'))
         }
         const token = generateJwt(user.id, user.email, user.role)
         return res.json({token})
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
        //const query = req.query
        //res.json(query)
    }

    async update(req, res, next) {
        const {id} = req.params
        const {name, surname, birthday} = req.body
        const user = User.upsert({
            id: id,
            name: name,
            surname: surname,
            birthday: birthday
        })
        return res.json(user)
    }

    async delete(req, res, next) {
        const {id} = req.params

        const basket = await Basket.findOne({where: { userId: id}})
        await BasketProduct.destroy({where: {basketId: basket.id}})
        basket.destroy()

        const favorite = await Favorite.findOne({where: { userId: id}})
        await FavoriteProduct.destroy({where: {favoriteId: favorite.id}})
        favorite.destroy()

        await User.destroy({
            where: {id}
        })

    }
}

module.exports = new UserController()
