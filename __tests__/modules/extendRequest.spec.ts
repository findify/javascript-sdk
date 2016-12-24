import * as expect from 'expect';
import { extendRequest } from '../../src/modules/extendRequest';

describe('extendRequest', () => {
  const q = 'test';
  const user = {
    uid: 'testUserId',
    sid: 'testSessionId',
  }

  it('should add props from "request" to result', () => {
    const requestData = {
      someProp: 'test2',
      otherProp: 'test3',
      q,
    }

    const extendedRequest = extendRequest(requestData, {
      user,
    });

    expect(extendedRequest).toInclude(requestData);
  });

  it('should add "log" from "configData" to result', () => {
    expect(extendRequest({
      q,
      user,
    }, {
      log: true,
    })).toInclude({
      log: true,
    });
  });

  it('should add "user" from "configData" to result', () => {
    expect(extendRequest({ q }, { user })).toInclude({ user });
  });

  it('should add "user" from "request" to result', () => {
    expect(extendRequest({ q, user })).toInclude({ user });
  });

  it('should overwrite "user" from "configData" if another is provided at "request"', () => {
    const user2 = {
      uid: 'testUserId2',
      sid: 'testSessionId2',
    };

    expect(extendRequest({ q, user }, { user: user2 })).toInclude({ user }).toExclude({ user: user2 });
  });

  it('should add "t_client" prop to result with current timestamp', () => {
    const extendedRequest = extendRequest({ q, user });
    expect(extendedRequest.t_client).toBeA('number');
  });

  it('should throw an Error if "user" prop is not provided neither at "configData" nor at "request"', () => {
    expect(() => extendRequest({ q })).toThrow(/`user` param should be provided either at request or at library config/);
  });

  it('should throw an Error if "user.uid" prop is not provided at "request"', () => {
    expect(() => extendRequest({
      q,
      user: {
        sid: 'testSessionId',
      } as any,
    })).toThrow(/"user.uid" param is required/);
  });

  it('should throw an Error if "user.sid" prop is not provided at "request"', () => {
    expect(() => extendRequest({
      q,
      user: {
        uid: 'testUserId',
      } as any,
    })).toThrow(/"user.sid" param is required/);
  });

  it('should throw an Error if "user.uid" prop is not provided at "configData"', () => {
    expect(() => extendRequest({ q }, {
      user: {
        sid: 'testSessionId',
      } as any,
    })).toThrow(/"user.uid" param is required/);
  });

  it('should throw an Error if "user.sid" prop is not provided at "configData"', () => {
    expect(() => extendRequest({ q }, {
      user: {
        uid: 'testUserId',
      } as any,
    })).toThrow(/"user.sid" param is required/);
  });
});
