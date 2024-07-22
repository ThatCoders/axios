import { PostMapping, RequestLog, RequestMapping, RequestSecurityPermit } from '../../decorator';

@RequestMapping('https://auto.thatapi.cn/welcome')
class UserMapper {
    @PostMapping('/login')
    @RequestLog
    @RequestSecurityPermit
    async login(userName: string = 'test', password: string = '123456', rememberMe: boolean = false) {}
}

export default new UserMapper();
