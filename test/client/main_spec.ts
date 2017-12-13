import * as main from '../../source/client/main';
import {expect} from 'chai';

describe('main', () => {

    it('should define window.inspect', () => {
      expect(window.inspect).to.not.be.null;
    });
});
