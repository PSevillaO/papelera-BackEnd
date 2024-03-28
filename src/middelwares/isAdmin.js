
function isAdmin(req, res, next) {

    if (req.user.role !== 'ADMIN_ROLE') {
        return res.status(403).send({
            ok: false,
            message: "No Tiene permisos para realizar esta accion"
        })
    }

    next();
}

module.exports = isAdmin;