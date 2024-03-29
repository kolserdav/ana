import {
  Locale,
  LocaleVars,
  SEARCH_MIN_LENGTH,
  MINIMAL_SUPPORT_TEXT_LENGTH,
} from '../../types/interfaces';

const lang: Locale = {
  server: {
    error: 'Server Error',
    badRequest: 'Bad Request',
    notFound: 'Not Found',
    success: 'Successful request',
    wrongPassword: 'Invalid email or password',
    emailIsSend: 'An email with instructions has been sent to the specified email address.',
    linkExpired: 'Link expired',
    linkUnaccepted: 'Invalid link',
    letterNotSend:
      'The account was created, but the email confirmation email was not sent due to an error',
    successConfirmEmail: 'This email has been successfully confirmed',
    forbidden: 'Access denied',
    unauthorized: 'Insufficient rights',
    notImplement: 'Obsolete request version',
    sendToSupport: 'Contact support',
    phraseSaved: 'Text(s) Saved',
    tagExists: 'The tag was previously created',
    tagSaved: 'Tag Saved',
    phraseDeleted: 'Text(s) deleted',
    phraseLoad: 'Text loaded from database',
    tagDeleted: 'Tag deleted',
    tagUpdated: 'Tag updated for all texts',
    serverReload: 'Server rebooting. This may take several minutes.',
    mailSubjects: {
      confirmEmail: 'Confirm email',
      resetPassword: 'Reset password',
      deletedAccount: 'Account deleted',
    },
    translateServiceNotWorking: 'Sorry, the translation service is temporarily unavailable',
    supportSuccess: 'The ticket has been sent to technical support',
    pushNotificationSaved: 'Push notification saved',
    pushNotificationDeleted: 'Push notification deleted',
  },
  app: {
    login: {
      loginButton: 'Login',
      register: 'Register',
      signIn: 'Sign in to an existing account',
      signUp: 'Sign Up New Account',
      email: 'Mail',
      name: 'Name',
      password: 'Password',
      passwordRepeat: 'Password repeat',
      fieldProhibited: 'Field contains prohibited characters',
      passwordMinLengthIs: 'Minimum password length',
      passwordMustContain: 'Password must contain at least one ',
      number: 'number',
      letter: 'letter',
      passwordsDoNotMatch: "Passwords don't match",
      emailIsUnacceptable: 'Mail is invalid',
      neededSelect: 'You need to make a choice',
      emailIsNotRegistered: 'This email is not registered with the service',
      emailIsRegistered: 'An account already exists for this email',
      successLogin: 'Successful Login',
      successRegistration: 'Successful registration',
      forgotPassword: 'Forgot your password?',
      restorePassword: 'Password Recovery',
      restoreDesc:
        'An email with password recovery instructions will be sent to the specified email address',
      changePassword: 'Change password',
      newPassword: 'New password',
      save: 'Save',
      wrongParameters: 'Invalid page parameters',
      sendNewLetter: 'Request new password reset email',
      acceptPolicyAndRules: 'I have read and accept before continuing',
      subtitle: 'To save texts, you must log in to the service',
    },
    appBar: {
      darkTheme: 'Dark Theme',
      homePage: 'Home',
      login: 'Sign in',
      logout: 'Sign out',
      translate: 'Translator',
      myDictionary: 'My texts',
      openMenu: 'Open menu',
      closeMenu: 'Close Menu',
      changeInterfaceLang: 'Change the interface language',
      about: 'About',
      closeApp: 'Close app',
      settings: 'Settings',
      statistics: 'Statistics',
      logoutDesc:
        "If you log out of your account, then you won't be able to access your saved tags and texts, and you won't be able to create new ones",
      yes: 'Yes',
      no: 'No',
      cancel: 'Cancel',
      send: 'Send',
      support: {
        title: 'Support',
        description: 'Send an email to technical support.',
        warning: 'To write to support, first confirm your mail, to do this, go to',
        subject: 'Email Subject',
        text: 'Ask a question or write a suggestion',
        subjectMustBeNotEmpty: 'Subject must not be empty',
        minimalLengthOfTextIs: `Minimum is ${MINIMAL_SUPPORT_TEXT_LENGTH} characters`,
      },
      trash: 'Learned texts',
      adminArea: 'Admin Area',
    },
    confirmEmail: {
      title: 'Mail Confirmation',
      paramsNotFound: 'Required page parameters not found',
      goBack: 'Back',
    },
    common: {
      formDesc: 'Fields marked with * are required',
      showHelp: 'Show help',
      somethingWentWrong: 'Something went wrong',
      fieldMustBeNotEmpty: 'Field must not be empty',
      eliminateRemarks: 'Eliminate form remarks',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel',
      policyTitle: 'Privacy Policy',
      rulesTitle: 'Service Rules',
      and: 'and',
      voiceNotFound: 'Special voice not found',
      playSound: 'Play text',
      sendMail: 'Send mail',
      emailIsSend: 'If the email does not arrive for a long time, then check the Spam folder',
      openTools: 'Open tools',
      copyText: {
        title: 'Copy text',
        textCopied: 'Text copied',
        copyTextError: 'Error copying text',
      },
      dateFilter: {
        forDay: 'per day',
        forWeek: 'for the week',
        forMonth: 'per month',
        forThreeMoths: 'for three months',
        forSixMonths: 'half a year',
        forYear: 'for the year',
        forAllTime: 'for all time',
      },
      sort: {
        byAlpha: 'Alphabetically',
        byNumeric: 'By number',
      },
      wrongUrlFormat: 'Invalid address format',
      openInApp: 'Open in App',
      needUpdateApp: 'The app needs to be updated to the latest version to support all features',
    },
    translate: {
      title: 'Creation of sentences',
      description: 'Practice your sentence creation skills on the texts you will be using',
      descEdit: 'Improve your sentences as your skills grow',
      nativeLang: 'I know',
      learnLang: 'Learning',
      allowRecomend: 'Apply suggested option',
      savePhrase: 'Save Text',
      createPhrase: 'Create Text',
      needLogin: 'Login required',
      savePhraseDesc: 'Save the text as a memento. You can then change or delete it at any time.',
      saveTranlsate: 'Save with translation',
      newTag: 'New Tag',
      changeTag: 'Change Tag',
      tagsTitle: 'Tags',
      tagHelp: 'Enter a space after the tag name to save it',
      addTags: 'Add Tags',
      updatePhrase: 'Edit Text',
      deleteTag: 'Delete Tag',
      deleteTagDesc: 'Also, all label links with texts will be deleted',
      updateTag: 'Update tag',
      textareaPlaceholder: "Write in the language you're learning",
      copied: 'Copied to clipboard',
      swapLangs: 'Swap languages',
      cleanField: 'Clear field',
      quitEdit: 'Quit edit mode',
      startRecognize: 'Hold to recognize speech',
      errorSpeechRecog: 'Speech recognition error',
      recognizeNotSupport: 'Speech recognition not supported',
      microNotPermitted: 'Microphone permission not received',
      serverIsNotConnected:
        'The server is not available or the client does not support the protocol',
      undo: 'Undo last operation',
      closeUpdateTag: 'Close Tag Update',
    },
    my: {
      title: 'My Texts',
      deletePhrase: 'Delete Text',
      updatePhrase: 'Change Text',
      byUpdateDate: 'By update time',
      filterByTags: 'Filter by tags',
      strongAccord: 'Strong match',
      emptyPhrases: 'No texts found for the specified filter',
      pagination: `Showing: ${LocaleVars.show} of ${LocaleVars.all}`,
      minimalSearchLenght: `Minimum ${SEARCH_MIN_LENGTH} character per word`,
      allLangs: 'all languages',
      selectAll: 'Select All',
      unselectAll: 'Unselect all',
      deleteSelected: 'Delete selected',
      moveSelectedToTrash: 'Move selected to learned',
      willDelete: `${LocaleVars.count} text(s) will be deleted`,
      resetAllFilters: 'Reset filters',
      playAll: 'Play All',
      selectPhrase: 'Select Text',
      translation: 'Translation',
      reTranslation: 'Reverse translation',
      trash: 'Learned texts',
      moveToTrash: 'Move to Learned',
      deleteImmediatly: 'Delete immediately',
      cleanTrash: 'Empty Learned',
      cleanTrashDesc: 'All texts will be permanently removed from the learned',
    },
    app: {
      connectionRefused: 'Connection to server lost',
      connectionReOpened: 'Server connection reopened',
      acceptCookies:
        'We use cookies by continuing to use the application you acknowledge that you have read and accept our',
      ok: 'Okay',
      withPolicy: 'Privacy Policy',
    },
    about: {
      aboutProgram: 'About the application',
      licenseTitle: 'Distributed under license',
      repoTitle: 'Source code',
      aboutSite: 'About this service',
      contactsTitle: 'Contacts',
      donate: 'Donate',
      packageVersion: 'Package version',
      download: 'Download the latest version',
      aboutTranslate: 'About translate engine',
    },
    settings: {
      title: 'Settings',
      speechSpeed: 'Speech speed',
      speechTest: 'Speech test',
      speechLang: 'Speech Language',
      speechSettings: 'Speech Settings',
      speechVoice: 'Speech voice',
      personalData: 'Personal data',
      deleteAccountTitle: 'Delete account',
      deleteAccountDesc:
        'Attention! Deleting your account will delete all the texts and tags you created, and you will no longer be able to log in to our service.',
      deleteAccountSecure: 'To confirm account deletion, enter',
      deleteVerifying: 'Deletion confirmation',
      deleteMyAccount: 'delete my account',
      deleteAccountWarning:
        'I understand that this operation cannot be undone. The account will be deleted immediately and permanently.',
      changePassword: 'Change password',
      emailIsConfirmed: 'Mail confirmed',
      sendConfirmEmail: 'Send confirmation email',
      selectNode: 'Select node',
      defaultNode: 'Default Node',
      customNode: 'Custom Node',
      serverIsNotRespond: 'Server not responding',
      saveVoiceTestText: 'Save for each voice',
      saveAllTestText: 'Save for all voices',
      successCheckNode:
        'The next time you run the application, it will be started from the specified server',
      notifications: {
        title: 'Notification settings',
        label: 'Receive Notifications',
        description: "Motivating Reminders. We'll try not to be too intrusive.",
      },
      powerSettings: {
        title: 'Performance settings',
        label: "Don't close connection when application is closed",
        description: 'Quick start or save',
      },
    },
    statistics: {
      title: 'Statistics',
      description: 'Track your stats to better control your curriculum',
      newTexts: 'Texts created',
      updatedTexts: 'Texts updated',
      trashedText: 'Texts learned',
      studyTime: 'Study time',
      dateDuration: {
        days: 'days',
        months: 'months',
        years: 'years',
        hours: 'hours',
        minutes: 'minutes',
        seconds: 'seconds',
      },
    },
    admin: {
      pushNotifications: 'Push notifications',
      createPushNotification: 'Create a push notification',
      editPushNotification: 'Edit the push notification',
      deletePushNotification: 'Delete the push notification',
      titleMustBeNotEmpty: 'Notification title must not be empty',
      pushTitle: 'Title of the notification',
      pushBody: 'Notification text',
      pushLanguage: 'Language of notification',
      pushPath: 'Page',
      pushPriority: "Notification's priority",
    },
  },
};

export default lang;
