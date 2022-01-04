describe('testing eventia egc interface', () => {
    beforeEach(() => {
      cy.visit("http://localhost:8080/")
      cy.get('#passwordId').type("eventiaegc2021")
      cy.get('#usernamedId').type("innosoft")
      cy.get('.p-button').click()
      cy.get('.p-paginator-pages > :nth-child(4)').click()
      cy.get('table')
        .find('tbody tr:last')
        .find('td')
        .last()
    })
  
    it('gmailButton', () => { 
      cy.get(':nth-child(2) > :nth-child(8) > :nth-child(2) > .mt-2')
      .click().get("input").should("not.have.value")
    })
    it('FacebookButton', () => { 
        cy.get(':nth-child(2) > :nth-child(8) > :nth-child(2) > .mr-2').click()
        cy.get('.p-dialog').get('#fbText').should("exist",'true')
    })
    it('telegramButton', () => { 
      cy.get(':nth-child(2) > :nth-child(8) > [style="display: flex;"] > :nth-child(4)')
      .click()
      cy.get('.p-dialog').get('#pv_id_3_header').should("exist","true")
    })
    it('twitterButton', () => { 
      cy.get(':nth-child(2) > :nth-child(8) > [style="display: flex;"] > :nth-child(3) > .pi')
      .click()
      cy.get('.p-dialog').get('#pv_id_4_content > .p-panel-content > .line-height-3').should("exist","true")
    })
    it('deleteButton', () => { 
      cy.get(':nth-child(2) > :nth-child(8) > [style="display: flex;"] > .p-button-danger').click()
      cy.get('.p-dialog-footer > :nth-child(2)').should("exist","true")
    })
    it('editButton', () => { 
      cy.get(':nth-child(2) > :nth-child(8) > [style="display: flex;"] > .p-button-primary').click()
      cy.get('.p-dialog-footer > :nth-child(2) > .p-button-label').should("exist","true")
    })
  
  })