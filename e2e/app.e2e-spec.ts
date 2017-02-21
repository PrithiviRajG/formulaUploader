import { FormulaeUploaderAppPage } from './app.po';

describe('formulae-uploader-app App', function() {
  let page: FormulaeUploaderAppPage;

  beforeEach(() => {
    page = new FormulaeUploaderAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
