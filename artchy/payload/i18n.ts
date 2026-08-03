import { nl } from "@payloadcms/translations/languages/nl";

/**
 * Nederlandse admin-interface.
 *
 * Payload levert zelf een nl-vertaling, maar die bevat gebiedende wijs
 * ("Bewaar", "Bewerk") en jargon ("Globalen"). Hieronder alleen de
 * teksten die we bewust anders willen: infinitief, u-vorm vermijden en
 * begrijpelijke woorden voor niet-technische beheerders.
 */
export const nederlandseVertalingen = {
  nl: {
    general: {
      save: "Opslaan",
      edit: "Bewerken",
      createNewLabel: "{{label}} aanmaken",
      editLabel: "{{label}} bewerken",
      newLabel: "Nieuwe {{label}}",
      creating: "Bezig met aanmaken…",
      updating: "Bezig met opslaan…",
      applyChanges: "Wijzigingen toepassen",
      globals: "Vaste pagina's",
      collections: "Overzichten",
      dashboard: "Overzicht",
      livePreview: "Voorbeeld",
      showAllLabel: "Alles uitklappen",
      collapse: "Inklappen",
      copy: "Kopiëren",
      duplicate: "Dupliceren",
      duplicateWithoutFile: "Dupliceren zonder bestand",
      moveDown: "Naar beneden",
      moveUp: "Naar boven",
      selectAll: "Alles selecteren",
      unsavedChanges:
        "Je hebt wijzigingen die nog niet zijn opgeslagen. Wil je doorgaan?",
      unsavedChangesDuplicate:
        "Je hebt wijzigingen die nog niet zijn opgeslagen. Wil je toch dupliceren?",
      leaveWithoutSaving:
        "Je hebt wijzigingen die nog niet zijn opgeslagen. Weet je zeker dat je deze pagina wilt verlaten?",
      stayOnThisPage: "Op deze pagina blijven",
      leaveAnyway: "Toch verlaten",
      confirmDuplication: "Dupliceren bevestigen",
      aboutToDelete:
        "Je staat op het punt {{label}} {{title}} te verwijderen. Weet je het zeker?",
      deletedCountSuccessfully: "{{count}} {{label}} verwijderd.",
      successfullyDuplicated: "{{label}} gedupliceerd.",
      noOptions: "Geen opties",
      loading: "Bezig met laden…",
      notFound: "Niet gevonden",
      nothingFound: "Niets gevonden",
      thisLanguage: "Nederlands",
    },
    authentication: {
      beginCreateFirstUser:
        "Maak om te beginnen je eerste beheerdersaccount aan.",
      createFirstUser: "Eerste beheerder aanmaken",
      logOut: "Uitloggen",
      loggingOut: "Bezig met uitloggen…",
      logIn: "Inloggen",
      logInSuccessful: "Je bent ingelogd.",
      loggedOutSuccessfully: "Je bent uitgelogd.",
      forgotPassword: "Wachtwoord vergeten",
      forgotPasswordQuestion: "Wachtwoord vergeten?",
      forgotPasswordEmailInstructions:
        "Vul je e-mailadres in. Je ontvangt dan een bericht om een nieuw wachtwoord in te stellen.",
      newPassword: "Nieuw wachtwoord",
      confirmPassword: "Wachtwoord bevestigen",
      changePassword: "Wachtwoord wijzigen",
      resetPassword: "Wachtwoord opnieuw instellen",
      account: "Mijn account",
      emailSent: "E-mail verstuurd",
      backToLogin: "Terug naar inloggen",
    },
    version: {
      saveDraft: "Concept opslaan",
      publish: "Publiceren",
      publishChanges: "Wijzigingen publiceren",
      published: "Gepubliceerd",
      draft: "Concept",
      unpublish: "Publicatie ongedaan maken",
      unpublishing: "Bezig met terugzetten naar concept…",
      restoreThisVersion: "Deze versie herstellen",
      restoredSuccessfully: "Versie hersteld.",
      restoring: "Bezig met herstellen…",
      versions: "Versies",
      version: "Versie",
      currentlyPublished: "Nu gepubliceerd",
      currentDraft: "Huidig concept",
      lastSavedAgo: "Laatst opgeslagen {{distance}} geleden",
      showLocales: "Talen tonen",
      changed: "Gewijzigd",
      status: "Status",
      draftSavedSuccessfully: "Concept opgeslagen.",
    },
    upload: {
      dragAndDrop: "Sleep een bestand hierheen",
      selectFile: "Bestand kiezen",
      fileName: "Bestandsnaam",
      fileSize: "Bestandsgrootte",
      width: "Breedte",
      height: "Hoogte",
      addImage: "Afbeelding toevoegen",
      editImage: "Afbeelding bewerken",
      previewSizes: "Voorbeeldformaten",
      sizesFor: "Formaten voor {{label}}",
    },
    fields: {
      addLabel: "{{label}} toevoegen",
      chooseFromExisting: "Kies een bestaande",
      chooseBetweenCustomTextOrDocument:
        "Kies een eigen tekst of een bestaande pagina",
      removeRelationship: "Koppeling verwijderen",
      editRelationship: "Koppeling bewerken",
      searchForBlockBySlug: "Zoeken",
      swapUpload: "Andere afbeelding kiezen",
      uploadNewLabel: "Nieuwe {{label}} uploaden",
    },
    error: {
      unknown: "Er ging iets mis. Probeer het opnieuw.",
      notAllowedToPerformAction: "Je mag deze actie niet uitvoeren.",
      unauthorized: "Je bent niet ingelogd, of je hebt hier geen toegang toe.",
      loadingDocument: "Deze pagina kon niet geladen worden.",
      deletingTitle: "{{title}} kon niet verwijderd worden.",
      noMatchedField: "Geen veld gevonden voor {{label}}",
      valueMustBeUnique: "Deze waarde bestaat al; kies een andere.",
      emailOrPasswordIncorrect: "E-mailadres of wachtwoord klopt niet.",
    },
    validation: {
      required: "Dit veld is verplicht.",
      emailAddress: "Vul een geldig e-mailadres in.",
      shorterThanMin:
        "Deze waarde is te kort; gebruik minimaal {{minLength}} tekens.",
      longerThanMax:
        "Deze waarde is te lang; gebruik maximaal {{maxLength}} tekens.",
      invalidInput: "Deze invoer klopt niet.",
      username:
        "Gebruik alleen letters, cijfers en de tekens . - _ zonder spaties.",
    },
  },
};

export const nederlandsePayloadTaal = nl;
