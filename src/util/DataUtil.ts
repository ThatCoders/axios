// TODO: 实现安全的获取json值
function safeGetJsonValue(json: any, keys: string[]): any {
    let value = json;
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return undefined;
        }
    }
    return value;
}
