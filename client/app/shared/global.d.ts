type AppCHF = string;
type AppChronos = string;
type AppColor = string;
type AppDate = string;
type AppEUR = string;
type AppEmail = string;
type AppPassword = string;
type AppToken = string;
type AppUpload = File;

// All IDs
// Ideally we should not use `any` at all, but we want to be able
// to use either a string or an entire subobject.
type AppCommentID = string | any;
type AppCountryID = string | any;
type AppEventID = string | any;
type AppFileID = string | any;
type AppImageID = string | any;
type AppLogID = string | any;
type AppMessageID = string | any;
type AppNewsID = string | any;
type AppOrderLineID = string | any;
type AppOrderID = string | any;
type AppOrganizationID = string | any;
type AppProductID = string | any;
type AppProductTagID = string | any;
type AppSessionID = string | any;
type AppSubscriptionID = string | any;
type AppUserID = string | any;
