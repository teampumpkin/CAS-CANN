/**
 * TEMPORARY ops endpoints for the v0.26 CRM migration (23 Nov 2026) — website DB follow-up.
 *
 * Purpose: relink form_submissions.zoho_crm_id so each submission points at the person's CURRENT CRM record:
 *   - set "six":  the 6 submissions behind the CRM records the migration created (applied 23 Nov),
 *   - set "full": 186 submissions whose zoho_crm_id has pointed at deleted Zoho ids since the May 2026 rebuild,
 *                 relinked to the v0.26 person's current record (185 by v0.26 backend row ids / email, + Millet -> Miller).
 * Only the zoho_crm_id column of these exact rows can change. submission_data (the original answers, which v0.26
 * says to preserve), statuses, retries, timestamps, submission_logs and every other row are never touched.
 *
 * Safety:
 *  - Auth: header `X-Ops-Token`. Only its SHA-256 is in the code (OPS_TOKEN_SHA256 env var may override it).
 *    Missing/wrong token, or any call after OPS_EXPIRES_AT, falls through to the site's normal handling of unknown
 *    paths (next('route')), so the endpoints are indistinguishable from paths that don't exist.
 *  - Writes are dry-run unless the body carries the exact confirm phrase.
 *  - Every write runs in ONE transaction with SELECT ... FOR UPDATE. Each row must still hold the expected old id and
 *    its expected status, and match its fingerprint (set six: SHA-256 of the email; set full: SHA-256 of the whole
 *    submission_data). Any mismatch on any row rolls back the whole set.
 *  - Every call is logged (without the token).
 * Remove this file and its one registration line once the relink is verified.
 */
import type { Express, Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { pool } from "./db";

const OPS_TOKEN_SHA256 = process.env.OPS_TOKEN_SHA256 || "9076330450158ad91deff82024687904e6ef335bdad53133c583fbdf38a29af4";
const OPS_EXPIRES_AT = new Date("2026-12-07T00:00:00Z");

type RelinkRow = { id: number; oldZohoId: string; newZohoId: string; ssot: string; ps: string; ss: string;
                   emailSha256?: string; dataSha256?: string };
export const RELINK_ROWS: RelinkRow[] = [
  { id: 370, oldZohoId: '6999043000003030001', newZohoId: '6999043000004138005', ssot: 'SSOT-139', emailSha256: '756da0641e87dc854b46b7cf2da43bac0f0c1d4360bc7c4044c9804ec884e613', ps: 'completed', ss: 'synced' },
  { id: 307, oldZohoId: '6999043000002515001', newZohoId: '6999043000004135013', ssot: 'SSOT-143', emailSha256: '64c35640918da7304472cf797a66943e3890b3f638a5cc9fca62179a00aebb61', ps: 'completed', ss: 'synced' },
  { id: 366, oldZohoId: '6999043000002897001', newZohoId: '6999043000004148016', ssot: 'SSOT-152', emailSha256: '3bbe37a5a0aac3f9cb4568f7be1a10cd73b6b0943f10d90419f908e3dc2f349a', ps: 'completed', ss: 'synced' },
  { id: 306, oldZohoId: '6999043000002513001', newZohoId: '6999043000004130016', ssot: 'SSOT-195', emailSha256: '657cd92013914ba47451033ee1253584eec09ea2f1e5b2dba2ea9665f122af4b', ps: 'completed', ss: 'synced' },
  { id: 311, oldZohoId: '6999043000002594001', newZohoId: '6999043000004138007', ssot: 'SSOT-214', emailSha256: '2062d9dc92afaa2faf1e68c0d005526fc10f76e1239c97fbed6683aa63888e63', ps: 'completed', ss: 'synced' },
  { id: 314, oldZohoId: '6999043000002605001', newZohoId: '6999043000004146009', ssot: 'SSOT-267', emailSha256: '3f57bcff1ca37b4cf8de2ed1ac15ede67d3bbf7ebeba2ab23ce68047172b2123', ps: 'completed', ss: 'synced' }
];
export const FULL_RELINK_ROWS: RelinkRow[] = [
  { id: 31, oldZohoId: '6999043000001664036', newZohoId: '6999043000003162344', ssot: 'SSOT-057', dataSha256: 'a3fb5fe8ff6c43aa8aa254cf34af2650edaa5a2f01fd9b1ca0d1971dbfb309bc', ps: 'completed', ss: 'synced' },
  { id: 34, oldZohoId: '6999043000001350240', newZohoId: '6999043000003162048', ssot: 'SSOT-001', dataSha256: '3f0f0a4aa0f070b20e8d018b1f0d82ab23d503e32babc8adb5724d6cdf2051d9', ps: 'completed', ss: 'synced' },
  { id: 35, oldZohoId: '6999043000001354182', newZohoId: '6999043000003162049', ssot: 'SSOT-169', dataSha256: 'f40c558b79aa525c5fa7f8228149f1247830ba04ce3d581416ae8e4db4f823e2', ps: 'completed', ss: 'synced' },
  { id: 36, oldZohoId: '6999043000001331282', newZohoId: '6999043000003162050', ssot: 'SSOT-002', dataSha256: '166f177fe86374f2d6065a1f4f21ad20d9ff888a69bb498849ec462a28ee31aa', ps: 'completed', ss: 'synced' },
  { id: 37, oldZohoId: '6999043000001343211', newZohoId: '6999043000003162051', ssot: 'SSOT-155', dataSha256: '7393c86d712bcaf46e6e9c80a3f6444e1a2f7834e13b381db5fc9da38006bdc0', ps: 'completed', ss: 'synced' },
  { id: 38, oldZohoId: '6999043000001345240', newZohoId: '6999043000003162052', ssot: 'SSOT-223', dataSha256: '596683017962949b1c05972b6da1db325be51533abb36d5799b1aab4f4ae3ffb', ps: 'completed', ss: 'synced' },
  { id: 39, oldZohoId: '6999043000001364265', newZohoId: '6999043000003162053', ssot: 'SSOT-003', dataSha256: '212719f194fdedc3e425e9daf47f7d897a8bb5ebc6363326f0917794d39d6211', ps: 'completed', ss: 'synced' },
  { id: 40, oldZohoId: '6999043000001347196', newZohoId: '6999043000003162054', ssot: 'SSOT-179', dataSha256: 'bfdb88476b0de9c15d0ce32943d210e9f1d0fdae6e17984061ae960f660f7ebf', ps: 'completed', ss: 'synced' },
  { id: 41, oldZohoId: '6999043000001333247', newZohoId: '6999043000003162055', ssot: 'SSOT-004', dataSha256: '491b1b120fd3dccd4c277f37de63d4ef5ae9d93e51594c71968e40772ca1a819', ps: 'completed', ss: 'synced' },
  { id: 42, oldZohoId: '6999043000001356271', newZohoId: '6999043000003162056', ssot: 'SSOT-005', dataSha256: '290b6a7d58f7cbaf4a3f04cd31733df3b16e717d65142b6d1d86525f06fc876a', ps: 'completed', ss: 'synced' },
  { id: 43, oldZohoId: '6999043000001355226', newZohoId: '6999043000003162057', ssot: 'SSOT-187', dataSha256: '53011f3ecab56e636a6b7cdb11e2bb039ce8632b34be5b16844ea02a6add5e27', ps: 'completed', ss: 'synced' },
  { id: 45, oldZohoId: '6999043000001687026', newZohoId: '6999043000003162059', ssot: 'SSOT-175', dataSha256: 'ce78d7f061c0c615c829480d23a5d1d8a88dd79a4c7d63993d7849f7aee97a45', ps: 'completed', ss: 'synced' },
  { id: 46, oldZohoId: '6999043000001680013', newZohoId: '6999043000003162060', ssot: 'SSOT-007', dataSha256: '2730b1ff336cd3df067c6c0f3feabf47f33583393d2edcdcfcd0ba25fe2eddfe', ps: 'completed', ss: 'synced' },
  { id: 47, oldZohoId: '6999043000001670045', newZohoId: '6999043000003162061', ssot: 'SSOT-008', dataSha256: '0824fae054a7c147cbdede79e08565039cfc1a2f0d9d03a9a6f277cd4619e569', ps: 'completed', ss: 'synced' },
  { id: 48, oldZohoId: '6999043000001663035', newZohoId: '6999043000003162062', ssot: 'SSOT-009', dataSha256: 'f42912f5bb97e7c818a30efc2d7ae53c481a1c07347ab021241fd3b15924b41c', ps: 'completed', ss: 'synced' },
  { id: 49, oldZohoId: '6999043000001676032', newZohoId: '6999043000003162063', ssot: 'SSOT-010', dataSha256: '02e4680a6cb1dbc13c9a89c4c0db1c5b932c009e5b254261bd88273405c62a2c', ps: 'completed', ss: 'synced' },
  { id: 50, oldZohoId: '6999043000001681026', newZohoId: '6999043000003162064', ssot: 'SSOT-228', dataSha256: 'e053cfd61a9d1bdecdfc5c0103a83917878641c4c0ed61816d63347b0e1ca8fb', ps: 'completed', ss: 'synced' },
  { id: 51, oldZohoId: '6999043000001665033', newZohoId: '6999043000003162065', ssot: 'SSOT-011', dataSha256: '09bfbbac0a6756038e40c6607ff4eae61ec13c4c6f89da1f2b7b278525a39690', ps: 'completed', ss: 'synced' },
  { id: 52, oldZohoId: '6999043000001684039', newZohoId: '6999043000003162066', ssot: 'SSOT-012', dataSha256: '0de426f042c226f1f7594377657bf183e84a2051e7fd3d81c9820adddc84fce2', ps: 'completed', ss: 'synced' },
  { id: 53, oldZohoId: '6999043000001663030', newZohoId: '6999043000003162067', ssot: 'SSOT-013', dataSha256: '33b5d936fad78f7bcabec2b11ba63444d1792bba21cea43d48428f5764a1aa54', ps: 'completed', ss: 'synced' },
  { id: 54, oldZohoId: '6999043000001347186', newZohoId: '6999043000003162068', ssot: 'SSOT-014', dataSha256: 'bfe6fda315ddff69ed745763db4d11a2ca889157e5308a1cd9ad7cb63e567f21', ps: 'completed', ss: 'synced' },
  { id: 55, oldZohoId: '6999043000001361221', newZohoId: '6999043000003162069', ssot: 'SSOT-006', dataSha256: '6aeb7df99b6d65ec0bdb5a46c2eadf4e9cfc7fb491ff49ee6e47570f34d2190f', ps: 'completed', ss: 'synced' },
  { id: 56, oldZohoId: '6999043000001350230', newZohoId: '6999043000003162070', ssot: 'SSOT-015', dataSha256: '9d03e11561aae80e94c38e962b35250e92be59690777ffdd3d72b225399f77f6', ps: 'completed', ss: 'synced' },
  { id: 57, oldZohoId: '6999043000001340216', newZohoId: '6999043000003162071', ssot: 'SSOT-016', dataSha256: '484b484520d66735a91573b252d16d9536e92849f2a17c980ddfd726f2839f6f', ps: 'completed', ss: 'synced' },
  { id: 58, oldZohoId: '6999043000001333242', newZohoId: '6999043000003162072', ssot: 'SSOT-017', dataSha256: 'e73f237b452f3651d7601dc66f474454dcd086d4e96daf030b5aadd95e103148', ps: 'completed', ss: 'synced' },
  { id: 59, oldZohoId: '6999043000001354177', newZohoId: '6999043000003162073', ssot: 'SSOT-189', dataSha256: 'a454f41aedfb5f23f81bca3723264622c9d6ec19e8fdd9813004980368871d10', ps: 'completed', ss: 'synced' },
  { id: 60, oldZohoId: '6999043000001342176', newZohoId: '6999043000003162074', ssot: 'SSOT-018', dataSha256: '0f433905eb41f78649bbbad46bd7a597c483ff444f1930a8b1285b424c516493', ps: 'completed', ss: 'synced' },
  { id: 61, oldZohoId: '6999043000001348196', newZohoId: '6999043000003162075', ssot: 'SSOT-196', dataSha256: '33f929e7303e3a38000e48975f2afa2db91c2f49b3f5b78dbecbee7ad34792d9', ps: 'completed', ss: 'synced' },
  { id: 62, oldZohoId: '6999043000001360206', newZohoId: '6999043000003162076', ssot: 'SSOT-215', dataSha256: 'dcfc1a7ea196c06845feb3d57bd0efd584c1c383715e4646e08628c06da2ffc1', ps: 'completed', ss: 'synced' },
  { id: 63, oldZohoId: '6999043000001344198', newZohoId: '6999043000003162077', ssot: 'SSOT-019', dataSha256: 'fd063edc26e0b1d753f759a25fec9f6d007b020f2f43290296e36e172c0edb39', ps: 'completed', ss: 'synced' },
  { id: 64, oldZohoId: '6999043000001700051', newZohoId: '6999043000003162078', ssot: 'SSOT-020', dataSha256: '7e947b748b48ce236c6f2661fa3da484d4101efb074fceb11a6762abe32312fb', ps: 'completed', ss: 'synced' },
  { id: 65, oldZohoId: '6999043000001359206', newZohoId: '6999043000003162079', ssot: 'SSOT-021', dataSha256: 'c8bee1a66249865ea1e8a4d0ce12973d04135ece5778ed7a171de8d6bd6add71', ps: 'completed', ss: 'synced' },
  { id: 66, oldZohoId: '6999043000001331277', newZohoId: '6999043000003162080', ssot: 'SSOT-146', dataSha256: '9fff3d8e659cee2657f934fb49795221dda25150014a4d0ed5562c812a4a9007', ps: 'completed', ss: 'synced' },
  { id: 67, oldZohoId: '6999043000001677012', newZohoId: '6999043000003162081', ssot: 'SSOT-022', dataSha256: '272f6f4df63bd046701886dfa464535ff1e871b1065b612e01df911bd8b088ea', ps: 'completed', ss: 'synced' },
  { id: 68, oldZohoId: '6999043000001681021', newZohoId: '6999043000003162082', ssot: 'SSOT-023', dataSha256: '818161c3cde22e2b558c5a9d70551c70f1163bea22c771183119ae185035e6ba', ps: 'completed', ss: 'synced' },
  { id: 69, oldZohoId: '6999043000001664031', newZohoId: '6999043000003162083', ssot: 'SSOT-024', dataSha256: 'c6d564848aac255cf12d4a23cb83063f1a3792cb91e61f076307f90377586b22', ps: 'completed', ss: 'synced' },
  { id: 70, oldZohoId: '6999043000001688017', newZohoId: '6999043000003162084', ssot: 'SSOT-207', dataSha256: '850d22ca61498abd511e1e20fe794f181d7cdea09060a593e0204dd0e27c49fc', ps: 'completed', ss: 'synced' },
  { id: 71, oldZohoId: '6999043000001671021', newZohoId: '6999043000003162085', ssot: 'SSOT-205', dataSha256: '456147db1b92bc7a1da712d8fe18f2b1fb5e72658a6bcb70c99e701ad5d1265b', ps: 'completed', ss: 'synced' },
  { id: 72, oldZohoId: '6999043000001676027', newZohoId: '6999043000003162086', ssot: 'SSOT-157', dataSha256: '90a148fd3eb2c273efb289f03aaeb54e9b3f824184461efe9437a84d4c75c69d', ps: 'completed', ss: 'synced' },
  { id: 73, oldZohoId: '6999043000001663025', newZohoId: '6999043000003162087', ssot: 'SSOT-025', dataSha256: '5fdc065f5aaed9c6f9aa9b726d6403e4d5c6e199f8826652bbfa5b77c761f78c', ps: 'completed', ss: 'synced' },
  { id: 74, oldZohoId: '6999043000001363303', newZohoId: '6999043000003162088', ssot: 'SSOT-206', dataSha256: 'd68b374a547c236fb9e12cd40b2056810b23ac987475d816b6875cf689867743', ps: 'completed', ss: 'synced' },
  { id: 75, oldZohoId: '6999043000001362201', newZohoId: '6999043000003162089', ssot: 'SSOT-026', dataSha256: '68f19b6b32fd029b3fa9468568e3fe70c425b81ad60f1303b4a6bc6dacca8789', ps: 'completed', ss: 'synced' },
  { id: 76, oldZohoId: '6999043000001354172', newZohoId: '6999043000003162090', ssot: 'SSOT-027', dataSha256: 'f11b342ec8189d9f178ee15522c07a4483768a1149dfe05bda80560dded84b29', ps: 'completed', ss: 'synced' },
  { id: 78, oldZohoId: '6999043000001364260', newZohoId: '6999043000003162092', ssot: 'SSOT-185', dataSha256: '8461deb91bc56f20b812c233fcf8f8ea98a33d610c9a39f170bb53659a0a7f07', ps: 'completed', ss: 'synced' },
  { id: 79, oldZohoId: '6999043000001333232', newZohoId: '6999043000003162093', ssot: 'SSOT-029', dataSha256: '0d24a03238baa26652eed3da7a0e7254c0745c4dbfe5a1345f1924dd86963c23', ps: 'completed', ss: 'synced' },
  { id: 80, oldZohoId: '6999043000001356266', newZohoId: '6999043000003162094', ssot: 'SSOT-234', dataSha256: '891abe161726fdd48b521c12e07fc45dfeff825a9a9b6652b819b39a2a9cc226', ps: 'completed', ss: 'synced' },
  { id: 81, oldZohoId: '6999043000001359201', newZohoId: '6999043000003162052', ssot: 'SSOT-223 (Millet->Miller)', dataSha256: '8c2e1971852d0d529e54ae31fa8e49f4139e30aa86856912202821ab6eeb4c78', ps: 'completed', ss: 'synced' },
  { id: 82, oldZohoId: '6999043000001354167', newZohoId: '6999043000003162096', ssot: 'SSOT-030', dataSha256: '757909b0234c2e65f9bd48a877b42fac44995c6f04e836fe6ef55618b126a7c0', ps: 'completed', ss: 'synced' },
  { id: 84, oldZohoId: '6999043000001679039', newZohoId: '6999043000003162098', ssot: 'SSOT-032', dataSha256: '9caf77ad7e1a3bc544a7b833f6be39d0cfea0ca90c88c6d41875f7f6e9881e7b', ps: 'completed', ss: 'synced' },
  { id: 85, oldZohoId: '6999043000001678029', newZohoId: '6999043000003162099', ssot: 'SSOT-033', dataSha256: 'a4c8b33d5ae04e91e9874b473bd4599a76b16ce62b886a0fb88fe613bce4c4cc', ps: 'completed', ss: 'synced' },
  { id: 86, oldZohoId: '6999043000001688012', newZohoId: '6999043000003162100', ssot: 'SSOT-034', dataSha256: '85807e61383ee06c0c4fa24eecd1fe3985e36f018efb5a910692c88218d91b1f', ps: 'completed', ss: 'synced' },
  { id: 87, oldZohoId: '6999043000001674038', newZohoId: '6999043000003162101', ssot: 'SSOT-035', dataSha256: '26db20d4d8f685338467aa334ee45dde8f2e6dc847fe2424d9d8cd191da20aea', ps: 'completed', ss: 'synced' },
  { id: 88, oldZohoId: '6999043000001669030', newZohoId: '6999043000003162102', ssot: 'SSOT-036', dataSha256: '3b3a6a7644e4ab0c19c1a91d623e071dde023bb6ad7165af8e882af8b4d24870', ps: 'completed', ss: 'synced' },
  { id: 89, oldZohoId: '6999043000001682048', newZohoId: '6999043000003162103', ssot: 'SSOT-037', dataSha256: '33975205512ffb7ea3e9b391214ce4779ed6b43b4a0b1d038db82ee54e1dbe07', ps: 'completed', ss: 'synced' },
  { id: 90, oldZohoId: '6999043000001677007', newZohoId: '6999043000003162104', ssot: 'SSOT-038', dataSha256: '97c36a99ca5ba0625c37fce29e59563c472d065a8fbe6da01120afb4c592391b', ps: 'completed', ss: 'synced' },
  { id: 91, oldZohoId: '6999043000001675026', newZohoId: '6999043000003162105', ssot: 'SSOT-039', dataSha256: 'aff1ddaa6e5c9a484b7bc00d5f7d6e66752e4c837177cdc66ba5a67a22d71e14', ps: 'completed', ss: 'synced' },
  { id: 92, oldZohoId: '6999043000001669025', newZohoId: '6999043000003162097', ssot: 'SSOT-031', dataSha256: '5130ae271e0335f50d085421919b6e18a20c24da29a0fe67421202e5d66ed16f', ps: 'completed', ss: 'synced' },
  { id: 93, oldZohoId: '6999043000001690024', newZohoId: '6999043000003162107', ssot: 'SSOT-040', dataSha256: '62749fa4f46b32d99d28c35052e6518f63068a81a5be7c2b0e73669c8063c1ee', ps: 'completed', ss: 'synced' },
  { id: 95, oldZohoId: '6999043000001347181', newZohoId: '6999043000003162109', ssot: 'SSOT-042', dataSha256: '91837163b7747ecc554f2610d936780faf93c15b52bbbfa88dd22286a111722b', ps: 'completed', ss: 'synced' },
  { id: 96, oldZohoId: '6999043000001333222', newZohoId: '6999043000003162110', ssot: 'SSOT-043', dataSha256: '74d5e305f5b5e6b78882266061d93ee31ccf9e43b193a07e11211ab39110e410', ps: 'completed', ss: 'synced' },
  { id: 99, oldZohoId: '6999043000001361216', newZohoId: '6999043000003162113', ssot: 'SSOT-199', dataSha256: '5d7a5bc48b9dd8cc547f2cd2dfc5a440c487beec315bace342cb99459ee189ff', ps: 'completed', ss: 'synced' },
  { id: 100, oldZohoId: '6999043000001333217', newZohoId: '6999043000003162114', ssot: 'SSOT-046', dataSha256: '564fe14e8c30fdb95a487af821e124c9694e406bfc49de5b64ef0e1a158b9d76', ps: 'completed', ss: 'synced' },
  { id: 102, oldZohoId: '6999043000001356261', newZohoId: '6999043000003162116', ssot: 'SSOT-163', dataSha256: 'e006a45d2d9106d86d3f5e12db375dd51187e1b916ab07cefdcb382b6183147f', ps: 'completed', ss: 'synced' },
  { id: 103, oldZohoId: '6999043000001355216', newZohoId: '6999043000003162117', ssot: 'SSOT-238', dataSha256: '4adc352ae70b18567ff76b3e4adc55a3afb46a7ba52a799e48ce1f25e8d00ccd', ps: 'completed', ss: 'synced' },
  { id: 104, oldZohoId: '6999043000001700036', newZohoId: '6999043000003162118', ssot: 'SSOT-048', dataSha256: '236bb8359bffc468d1bc8f7f915c60da60991bf7122c0f8597dcb08e5d2490fb', ps: 'completed', ss: 'synced' },
  { id: 105, oldZohoId: '6999043000001684034', newZohoId: '6999043000003162119', ssot: 'SSOT-184', dataSha256: 'f9a56669d52c20c83058e15654342ece1b5134b83a12770d210676ab0751bc23', ps: 'completed', ss: 'synced' },
  { id: 107, oldZohoId: '6999043000001674033', newZohoId: '6999043000003162121', ssot: 'SSOT-049', dataSha256: '62a82948f98ac233910f5ccb59dccfdaedaf58a957e0d54fdefe0be23f0abdac', ps: 'completed', ss: 'synced' },
  { id: 108, oldZohoId: '6999043000001671032', newZohoId: '6999043000003162122', ssot: 'SSOT-050', dataSha256: '0ebe2dc0ae32dc42979dc9e04516c0f9474ebb99579510e8bd87813f7e4c60f2', ps: 'completed', ss: 'synced' },
  { id: 109, oldZohoId: '6999043000001685033', newZohoId: '6999043000003162123', ssot: 'SSOT-051', dataSha256: '90d687d91d8c4e6a5708d2a0ab65d042f4bb39b9a73cba5e0078d7ac0149630f', ps: 'completed', ss: 'synced' },
  { id: 110, oldZohoId: '6999043000001358230', newZohoId: '6999043000003162124', ssot: 'SSOT-200', dataSha256: '1b4386f6679e2fb077f460c66ef4236e500fb86f5198ca69f4c015d44e13e7ac', ps: 'completed', ss: 'synced' },
  { id: 111, oldZohoId: '6999043000001671027', newZohoId: '6999043000003162091', ssot: 'SSOT-028', dataSha256: '1b4dffb1f869396097c0ca29345d0ec1e6829dc5c2eae9c82176318fe4dceb82', ps: 'completed', ss: 'synced' },
  { id: 112, oldZohoId: '6999043000001356256', newZohoId: '6999043000003162126', ssot: 'SSOT-052', dataSha256: 'e551c8cb83503d61bbcbb8a45369eff1edc5fb183f605c50a9358706e8a5c9fb', ps: 'completed', ss: 'synced' },
  { id: 113, oldZohoId: '6999043000001682038', newZohoId: '6999043000003162111', ssot: 'SSOT-044', dataSha256: 'f1dd8c515e8611eafe7a47be6068859d142b5bdb00dbd4d823c41f6cae052f8a', ps: 'completed', ss: 'synced' },
  { id: 114, oldZohoId: '6999043000001346235', newZohoId: '6999043000003162128', ssot: 'SSOT-053', dataSha256: '91c04f4efc71731d490da07139c482b95e643b2216dca36fb17e9026be803915', ps: 'completed', ss: 'synced' },
  { id: 115, oldZohoId: '6999043000001331267', newZohoId: '6999043000003162129', ssot: 'SSOT-054', dataSha256: '3b33554357eb9ff43cba7e4fd3b80f63efa4ce94f366d2da6138f13fd30d59da', ps: 'completed', ss: 'synced' },
  { id: 116, oldZohoId: '6999043000001346230', newZohoId: '6999043000003162130', ssot: 'SSOT-055', dataSha256: 'ecc0ed63e2557afa9418c638d1eee6d8e5b41145242c05cab1faa887e2d1a4b9', ps: 'completed', ss: 'synced' },
  { id: 117, oldZohoId: '6999043000001353216', newZohoId: '6999043000003162131', ssot: 'SSOT-192', dataSha256: '7f57602db96f903c0bd46e94b94585f0cf0fb198e2a5b08c1a142e8fa3305b93', ps: 'completed', ss: 'synced' },
  { id: 118, oldZohoId: '6999043000001338161', newZohoId: '6999043000003162132', ssot: 'SSOT-160', dataSha256: '997014fcd585b526c0fa492af52cb573d8f76bf5a2063f3781f17a62040ce8ae', ps: 'completed', ss: 'synced' },
  { id: 119, oldZohoId: '6999043000001354162', newZohoId: '6999043000003162133', ssot: 'SSOT-174', dataSha256: 'ce77e5fa965ef515feceb7588c372610afb894e1f987d16ed3444051053d3fce', ps: 'completed', ss: 'synced' },
  { id: 120, oldZohoId: '6999043000001663020', newZohoId: '6999043000003162108', ssot: 'SSOT-041', dataSha256: '925de2ed9d3fe7f533e7b1f07524baa3ac56bf4b3e43d89c09209df21bce0456', ps: 'completed', ss: 'synced' },
  { id: 121, oldZohoId: '6999043000001664026', newZohoId: '6999043000003162135', ssot: 'SSOT-056', dataSha256: '59f85b7a6bb81542c24b4edccf4f1a35bd6aee60b369c819dddae38bf96e1b65', ps: 'completed', ss: 'synced' },
  { id: 122, oldZohoId: '6999043000001683015', newZohoId: '6999043000003162115', ssot: 'SSOT-047', dataSha256: 'a896691b12bb353137a9793e315467fb66e7e9c3f016d7eea78025105d4a1283', ps: 'completed', ss: 'synced' },
  { id: 124, oldZohoId: '6999043000001664021', newZohoId: '6999043000003162138', ssot: 'SSOT-151', dataSha256: 'defa9395a50b676c98f2c21ea2776bd537a7e4f8db870af60ec2458f82364956', ps: 'completed', ss: 'synced' },
  { id: 125, oldZohoId: '6999043000001678024', newZohoId: '6999043000003162112', ssot: 'SSOT-045', dataSha256: '4ab8f5a8c63584b284afbface6d395aa1ede3aab2e2b0f995428913a6cca4d55', ps: 'completed', ss: 'synced' },
  { id: 126, oldZohoId: '6999043000001361211', newZohoId: '6999043000003162140', ssot: 'SSOT-058', dataSha256: '0021adcf9345811a6f3547755e6d6e321e7d3e44b3eaa63ad6cec999185bc03f', ps: 'completed', ss: 'synced' },
  { id: 127, oldZohoId: '6999043000001671016', newZohoId: '6999043000003162141', ssot: 'SSOT-241', dataSha256: '574c3a118bcfad201bf2051c722b7ac73dec3119b34cda62c72b1b55ee74abcc', ps: 'completed', ss: 'synced' },
  { id: 128, oldZohoId: '6999043000001690019', newZohoId: '6999043000003162142', ssot: 'SSOT-220', dataSha256: '2fbccb5aedcd1aee91337fde86acf173cbdd2112c043ca207165ee2fbda0a624', ps: 'completed', ss: 'synced' },
  { id: 129, oldZohoId: '6999043000001349195', newZohoId: '6999043000003162143', ssot: 'SSOT-059', dataSha256: 'a85976fb059c7025341e1833c21649302675dfadd816b2446937a2a8522bf80f', ps: 'completed', ss: 'synced' },
  { id: 130, oldZohoId: '6999043000001364240', newZohoId: '6999043000003162144', ssot: 'SSOT-060', dataSha256: '04b9d5940f3b571c2c8c2ff7041119410d741f72c679d68f8c0f257ba4e3f539', ps: 'completed', ss: 'synced' },
  { id: 131, oldZohoId: '6999043000001351217', newZohoId: '6999043000003162145', ssot: 'SSOT-204', dataSha256: '0d640978e395ef634cddd652aa223da863f46a9eff1e0795b522248654279a4c', ps: 'completed', ss: 'synced' },
  { id: 132, oldZohoId: '6999043000001343191', newZohoId: '6999043000003162146', ssot: 'SSOT-161', dataSha256: '36a9b3e265b0aa2b0d7d91242a18975421cd3aaafe126b9e3668be12dd3b9c0a', ps: 'completed', ss: 'synced' },
  { id: 133, oldZohoId: '6999043000001353211', newZohoId: '6999043000003162147', ssot: 'SSOT-154', dataSha256: 'e153b5a531c92969b055a9bd7c316b3b003569424617da099196cb646f35553d', ps: 'completed', ss: 'synced' },
  { id: 134, oldZohoId: '6999043000001364235', newZohoId: '6999043000003162148', ssot: 'SSOT-061', dataSha256: 'ee04c0d46717e9315fc30eb9e7f24209fdd52fe04caf312ea85e41b7689db52c', ps: 'completed', ss: 'synced' },
  { id: 135, oldZohoId: '6999043000001347171', newZohoId: '6999043000003162149', ssot: 'SSOT-190', dataSha256: 'd8b2b63df23bc5e60f3a923111362a682aecbc5b9d23daa5d24b706126a021f2', ps: 'completed', ss: 'synced' },
  { id: 136, oldZohoId: '6999043000001342161', newZohoId: '6999043000003162150', ssot: 'SSOT-062', dataSha256: '05da006028b1f51708bff1c4003b9c84c96cfff0687ab7d5ef615ede3d3592e5', ps: 'completed', ss: 'synced' },
  { id: 137, oldZohoId: '6999043000001357201', newZohoId: '6999043000003162151', ssot: 'SSOT-063', dataSha256: 'e2d41f26f7208641b19d934e5fdebe88fe80a5c868a1f5b6062e3abbdc4299eb', ps: 'completed', ss: 'synced' },
  { id: 138, oldZohoId: '6999043000001343181', newZohoId: '6999043000003162152', ssot: 'SSOT-064', dataSha256: 'df58104114a12172ac7bb7625ab8db613b48007f70519b7c579fead99ac5f734', ps: 'completed', ss: 'synced' },
  { id: 139, oldZohoId: '6999043000001345220', newZohoId: '6999043000003162153', ssot: 'SSOT-065', dataSha256: '096a344ba101fb819e60c57b30d03ad5cb1e0fba9c4193741471c3a6bdcb807d', ps: 'completed', ss: 'synced' },
  { id: 140, oldZohoId: '6999043000001362191', newZohoId: '6999043000003162154', ssot: 'SSOT-218', dataSha256: 'fd5a162fcd6a742f0b61e3fd247dea2430f94cafaaab0f2f44acff1d5d1bcf76', ps: 'completed', ss: 'synced' },
  { id: 141, oldZohoId: '6999043000001350215', newZohoId: '6999043000003162155', ssot: 'SSOT-066', dataSha256: '29fa021722707cff8e79f699f9f0854c440d978d4e129da97fbfbccefcb1cfa6', ps: 'completed', ss: 'synced' },
  { id: 142, oldZohoId: '6999043000001352171', newZohoId: '6999043000003162156', ssot: 'SSOT-067', dataSha256: 'c4a395ccbd7e64c3caaad4acfdd71c08a8cf248738efadf0b87a0a114689e2d4', ps: 'completed', ss: 'synced' },
  { id: 143, oldZohoId: '6999043000001331262', newZohoId: '6999043000003162157', ssot: 'SSOT-068', dataSha256: 'fd3725c2258c9816bbaf5143d94d1e12e4c75f8c1658ecbfdbf6dab1358f7883', ps: 'completed', ss: 'synced' },
  { id: 144, oldZohoId: '6999043000001344173', newZohoId: '6999043000003162158', ssot: 'SSOT-156', dataSha256: '2c2bd35dcf14f9d0b05f1311ff7754e8cd286da8dc68ec23797d27315decb85f', ps: 'completed', ss: 'synced' },
  { id: 145, oldZohoId: '6999043000001363283', newZohoId: '6999043000003162159', ssot: 'SSOT-069', dataSha256: 'e032819a35d30a7015afd4a496ba9c45915e91e5aaf8af47da5cf82306b2cb0e', ps: 'completed', ss: 'synced' },
  { id: 146, oldZohoId: '6999043000001347161', newZohoId: '6999043000003162160', ssot: 'SSOT-070', dataSha256: 'eb68c2cf748d99cdbfd6e60d0749570bb3905ce8c79d42508831e1ef52363678', ps: 'completed', ss: 'synced' },
  { id: 147, oldZohoId: '6999043000001360196', newZohoId: '6999043000003162161', ssot: 'SSOT-158', dataSha256: '1962a54b439bb12b9870ded799a20b9de12f056342b8f9917892d9c60ac5bcaa', ps: 'completed', ss: 'synced' },
  { id: 148, oldZohoId: '6999043000001351207', newZohoId: '6999043000003162162', ssot: 'SSOT-071', dataSha256: '6c2e0cc046d564d59ce9299ec7d0bb81c05c7da978a9db31f2c6fad891b7b269', ps: 'completed', ss: 'synced' },
  { id: 149, oldZohoId: '6999043000001359186', newZohoId: '6999043000003162163', ssot: 'SSOT-072', dataSha256: '4d716fc2af421a3b309547474c9217407e0c035a9f2e19d25d65fb68f058ce1a', ps: 'completed', ss: 'synced' },
  { id: 150, oldZohoId: '6999043000001342151', newZohoId: '6999043000003162164', ssot: 'SSOT-073', dataSha256: 'cc9046ea33a20fc9f0b1cd854af51acbbad0c962344c9d9fbd0f65e8a8986bac', ps: 'completed', ss: 'synced' },
  { id: 151, oldZohoId: '6999043000001357191', newZohoId: '6999043000003162165', ssot: 'SSOT-166', dataSha256: '0913b31eca87bb3bdf1121857c3a3f24bdd1a132f9d6517cf8f23337a750b86a', ps: 'completed', ss: 'synced' },
  { id: 152, oldZohoId: '6999043000001361201', newZohoId: '6999043000003162166', ssot: 'SSOT-074', dataSha256: '2c6f51ea904107e2403840aa64aa60ed66043f6581b562d5a929cee018df695a', ps: 'completed', ss: 'synced' },
  { id: 153, oldZohoId: '6999043000001355201', newZohoId: '6999043000003162167', ssot: 'SSOT-171', dataSha256: 'f9e1dac909843f76ef34b24ef371ee8af348b38aff522e04bf382e3b6dd5b305', ps: 'completed', ss: 'synced' },
  { id: 154, oldZohoId: '6999043000001364225', newZohoId: '6999043000003162168', ssot: 'SSOT-240', dataSha256: 'ff6923211c61a23effe5b8f97a89169cc720965286cb6e622fecb525c161c52f', ps: 'completed', ss: 'synced' },
  { id: 155, oldZohoId: '6999043000001350205', newZohoId: '6999043000003162169', ssot: 'SSOT-075', dataSha256: 'fb78e87e2d421af4a23f371bb794409b718bbec5c750ce68c6c1a416c18f6f7c', ps: 'completed', ss: 'synced' },
  { id: 156, oldZohoId: '6999043000001354147', newZohoId: '6999043000003162170', ssot: 'SSOT-076', dataSha256: '8bbc0a3188180bddda6d317448abf69630672ba2a9ea483195496dbec7345e4c', ps: 'completed', ss: 'synced' },
  { id: 157, oldZohoId: '6999043000001348176', newZohoId: '6999043000003162171', ssot: 'SSOT-219', dataSha256: 'c73e01ecf74ab066c8899895660b0da1489292d222eed7c93965d0523b2c9d84', ps: 'completed', ss: 'synced' },
  { id: 158, oldZohoId: '6999043000001353206', newZohoId: '6999043000003162172', ssot: 'SSOT-202', dataSha256: '52fa39a4c427dacb3585fe73245e41ae3eeb83f99b970c876e1dccac3f6b05f5', ps: 'completed', ss: 'synced' },
  { id: 159, oldZohoId: '6999043000001338146', newZohoId: '6999043000003162173', ssot: 'SSOT-077', dataSha256: 'f4c2c1f3e961fa32f8f7b49ddad5213e4eb24bd3ecca85f54570aa1192242de7', ps: 'completed', ss: 'synced' },
  { id: 160, oldZohoId: '6999043000001360191', newZohoId: '6999043000003162174', ssot: 'SSOT-078', dataSha256: 'd3b9c7b3ab26aef5d88836a261c19b4de7fe28646a27df64ee222da6d13d16f2', ps: 'completed', ss: 'synced' },
  { id: 161, oldZohoId: '6999043000001343176', newZohoId: '6999043000003162175', ssot: 'SSOT-079', dataSha256: '9319063307404ccc82699f7fe40996c1bb8c39ba1be6c18a28922a2f20aa190f', ps: 'completed', ss: 'synced' },
  { id: 162, oldZohoId: '6999043000001338141', newZohoId: '6999043000003162176', ssot: 'SSOT-080', dataSha256: 'f60e4a08ef036ed3920fb83daab04e0492625aeb98da841e873e0bac358b2266', ps: 'completed', ss: 'synced' },
  { id: 163, oldZohoId: '6999043000001344168', newZohoId: '6999043000003162177', ssot: 'SSOT-141', dataSha256: '1efc9068c50aaa076ef7bfaf6a0f6838b912155c59ad7c29b4dc0fb54fce1e5f', ps: 'completed', ss: 'synced' },
  { id: 164, oldZohoId: '6999043000001700026', newZohoId: '6999043000003162178', ssot: 'SSOT-081', dataSha256: '66fa10b5a383cbcb4451322e3c1e8c324a6b9887522a01beb0bb79cfcacda562', ps: 'completed', ss: 'synced' },
  { id: 165, oldZohoId: '6999043000001684029', newZohoId: '6999043000003162179', ssot: 'SSOT-082', dataSha256: '834a6a73277d8b062da8fdcb8ebc2578466f069d0ef6dbc96f7dd48289433643', ps: 'completed', ss: 'synced' },
  { id: 166, oldZohoId: '6999043000001685028', newZohoId: '6999043000003162180', ssot: 'SSOT-083', dataSha256: '61de1a6652f6eeae3eee94b98ab889c17b105d094c9ccef8202bb2e601b57727', ps: 'completed', ss: 'synced' },
  { id: 167, oldZohoId: '6999043000001359226', newZohoId: '6999043000003162067', ssot: 'SSOT-013', dataSha256: '7f353c9767cc808223535a49c0dc4a6888450f7377bc773d258a0493db64de06', ps: 'completed', ss: 'synced' },
  { id: 168, oldZohoId: '6999043000001347231', newZohoId: '6999043000003162066', ssot: 'SSOT-012', dataSha256: 'fe2ce1076f528ffa1ba6df04124d4c455e7d77110f70439b34fefe12861e5e13', ps: 'completed', ss: 'synced' },
  { id: 169, oldZohoId: '6999043000001340236', newZohoId: '6999043000003162270', ssot: 'SSOT-242', dataSha256: '34d3ead1e400e006f224d63756f524ee5e91f13e78d9534e4d0ee2504dff6b78', ps: 'completed', ss: 'synced' },
  { id: 170, oldZohoId: '6999043000001352206', newZohoId: '6999043000003162184', ssot: 'SSOT-087', dataSha256: '03c44a52b34fd82046332f03ee9ab1d7b9d10461f4dee5abc8471acd423ed073', ps: 'completed', ss: 'synced' },
  { id: 171, oldZohoId: '6999043000001331317', newZohoId: '6999043000003162272', ssot: 'SSOT-243', dataSha256: '72c5370f0d55a034f96da57ee7ec4f97b081d578d2cec11715820fd3b0c6b5c6', ps: 'completed', ss: 'synced' },
  { id: 172, oldZohoId: '6999043000001346265', newZohoId: '6999043000003162102', ssot: 'SSOT-036', dataSha256: 'e679568c8fee9fb7a50be94d8b254a40a696e688b4d85b826bae8577fdb444dc', ps: 'completed', ss: 'synced' },
  { id: 173, oldZohoId: '6999043000001682033', newZohoId: '6999043000003162274', ssot: 'SSOT-244', dataSha256: 'e660831554dce444db35cfe321b4e565ce1dcd06ec7501b67daa80de8feb3dfb', ps: 'completed', ss: 'synced' },
  { id: 174, oldZohoId: '6999043000001670040', newZohoId: '6999043000003162275', ssot: 'SSOT-245', dataSha256: '63bacced0c235220a4813edeb1a2863bdd5096b94330ebbe27a416a99984db51', ps: 'completed', ss: 'synced' },
  { id: 175, oldZohoId: '6999043000001690014', newZohoId: '6999043000003162068', ssot: 'SSOT-014', dataSha256: 'a8f15122cd99e99f10dddc276034ec3fd889b56e4643f3459c7215fe4c0a3c34', ps: 'completed', ss: 'synced' },
  { id: 176, oldZohoId: '6999043000001673038', newZohoId: '6999043000003162277', ssot: 'SSOT-246', dataSha256: '97732ee4e0f5fe9b46a6e6ab3460557a74b4428288f635a1f2fd9a0ab1672584', ps: 'completed', ss: 'synced' },
  { id: 177, oldZohoId: '6999043000001689017', newZohoId: '6999043000003162063', ssot: 'SSOT-010', dataSha256: '2dc82dc875930995303aa1ce85a33f53808f76d04700d4f6dfe6ad22449a7753', ps: 'completed', ss: 'synced' },
  { id: 178, oldZohoId: '6999043000001358260', newZohoId: '6999043000003162279', ssot: 'SSOT-248', dataSha256: '465a883b1e87ecca648847e8203d34a849a05772619244cd108262ef44f85410', ps: 'completed', ss: 'synced' },
  { id: 179, oldZohoId: '6999043000001349240', newZohoId: '6999043000003162280', ssot: 'SSOT-249', dataSha256: 'aed5fc3c674f2d2eecaa90fe3bad843b84f1aeae51383e4816f3c1cdc44a3ac0', ps: 'completed', ss: 'synced' },
  { id: 180, oldZohoId: '6999043000001347226', newZohoId: '6999043000003162281', ssot: 'SSOT-250', dataSha256: '5baefc2b4df1dfb2c5ef85746c7bf395017caa3fff2c005a1adfc5832ef5b6ca', ps: 'completed', ss: 'synced' },
  { id: 181, oldZohoId: '6999043000001352196', newZohoId: '6999043000003162234', ssot: 'SSOT-107', dataSha256: 'b7e83f6d1978255d1eca1f4c3471e3f65df9408612d53382a91b5b5e286c3b0c', ps: 'completed', ss: 'synced' },
  { id: 182, oldZohoId: '6999043000001357221', newZohoId: '6999043000003162283', ssot: 'SSOT-254', dataSha256: '76368a1b4efa99d1bcefeb55dafabd3ff367ef25dcb649b44ef5dc72eae5ba9f', ps: 'completed', ss: 'synced' },
  { id: 183, oldZohoId: '6999043000001356281', newZohoId: '6999043000003162284', ssot: 'SSOT-253', dataSha256: '4d4282d04c4b4866818022723843a5e337bd4b7d26f1f8ebe2866eaa734d0170', ps: 'completed', ss: 'synced' },
  { id: 184, oldZohoId: '6999043000001363318', newZohoId: '6999043000003162149', ssot: 'SSOT-190', dataSha256: '0e6e30f7e2f384ab3e20b8d2107fded405b8e89c75c7993028f9e27fe48a3e94', ps: 'completed', ss: 'synced' },
  { id: 185, oldZohoId: '6999043000001362246', newZohoId: '6999043000003162105', ssot: 'SSOT-039', dataSha256: '08acda3fd2e0f96a1cda01183edaed2babc07b7bb5eed1125d0972d75d01b586', ps: 'completed', ss: 'synced' },
  { id: 186, oldZohoId: '6999043000001669035', newZohoId: '6999043000003162121', ssot: 'SSOT-049', dataSha256: '7d3d1ff7387cc7553e53cf2f08beb2920d1154fe4e1b309d67cb13dbbff5c80f', ps: 'completed', ss: 'synced' },
  { id: 187, oldZohoId: '6999043000001663015', newZohoId: '6999043000003162288', ssot: 'SSOT-255', dataSha256: '63d536f4d840ce10fa2c209e92b13fbc97df48bceefa5c3aa6d701edc4eb8072', ps: 'completed', ss: 'synced' },
  { id: 188, oldZohoId: '6999043000001669020', newZohoId: '6999043000003162289', ssot: 'SSOT-256', dataSha256: '46be79a801d7cc1d88525cb6f1ad2309c790e963a52f7798f4b8af171503a717', ps: 'completed', ss: 'synced' },
  { id: 189, oldZohoId: '6999043000001683010', newZohoId: '6999043000003162290', ssot: 'SSOT-247', dataSha256: '10c1997f2c6a6f8c085854e7b2bcff2aa0ee2261869ae1c61f07b09f7099b7aa', ps: 'completed', ss: 'synced' },
  { id: 190, oldZohoId: '6999043000001673033', newZohoId: '6999043000003162291', ssot: 'SSOT-257', dataSha256: 'fecfe1387f6d94b7cc3966a960ffd3ddc3b3b762b58ad828f372dd1a005a99b1', ps: 'completed', ss: 'synced' },
  { id: 191, oldZohoId: '6999043000001685023', newZohoId: '6999043000003162075', ssot: 'SSOT-196', dataSha256: '6acf0d6768f91e64edbf8408f3a2d69ea9e13e0407ded7af4569854ca15df7fa', ps: 'completed', ss: 'synced' },
  { id: 192, oldZohoId: '6999043000001700021', newZohoId: '6999043000003162293', ssot: 'SSOT-252', dataSha256: '8a6cc258f85680b598c41db216ad7a3cbdf1ed3a141ec81e81542ae2db3b22c0', ps: 'completed', ss: 'synced' },
  { id: 193, oldZohoId: '6999043000001681031', newZohoId: '6999043000003162069', ssot: 'SSOT-006', dataSha256: '910fff62ce1b86ec2ff70db51bc50089e83f600aa70eca5de65ef706a79f3c15', ps: 'completed', ss: 'synced' },
  { id: 194, oldZohoId: '6999043000001688007', newZohoId: '6999043000003162295', ssot: 'SSOT-258', dataSha256: '2c32a4c2f26dc7bfb964b266beff87ec99d44bd49ae53560a534d42b02bdf13d', ps: 'completed', ss: 'synced' },
  { id: 195, oldZohoId: '6999043000001667036', newZohoId: '6999043000003162296', ssot: 'SSOT-251', dataSha256: '80b4bbd467baf8b41cfc710fdf5b24ecc5e25ce8b6dc9072773b116ec30b37da', ps: 'completed', ss: 'synced' },
  { id: 197, oldZohoId: '6999043000001528002', newZohoId: '6999043000003162343', ssot: 'SSOT-266', dataSha256: '3417776fcdd888b525e4679924c0d6617621d4f11fc52dd6cf381b3dc1b413f6', ps: 'completed', ss: 'synced' },
  { id: 202, oldZohoId: '6999043000001560001', newZohoId: '6999043000003162341', ssot: 'SSOT-135', dataSha256: 'fd45cdb100b390959674d352cca7c437df3768fa8e285168273c4ad70b85d370', ps: 'completed', ss: 'synced' },
  { id: 239, oldZohoId: '6999043000001643002', newZohoId: '6999043000003162338', ssot: 'SSOT-259', dataSha256: '4a1524a73029b64cee8598a39bfe1c4c23387e0b91531fadd5533331aadbb017', ps: 'completed', ss: 'synced' },
  { id: 244, oldZohoId: '6999043000001669041', newZohoId: '6999043000003162337', ssot: 'SSOT-134', dataSha256: '63912a4bfd4359359e9ad1d370567b4cc4899bc5e0b6908d50c1a08a65be5555', ps: 'completed', ss: 'synced' },
  { id: 249, oldZohoId: '6999043000001734002', newZohoId: '6999043000003162336', ssot: 'SSOT-144', dataSha256: '065d3422095f4a570a264f860e9273e606cf91b65caa28e0a534cda8aa21137d', ps: 'completed', ss: 'synced' },
  { id: 251, oldZohoId: '6999043000001961002', newZohoId: '6999043000003162334', ssot: 'SSOT-132', dataSha256: 'b17bc2caccca67a5dd9eafe4193c7838301731f032dabc9131d2b67186ffaaa4', ps: 'completed', ss: 'synced' },
  { id: 252, oldZohoId: '6999043000001965018', newZohoId: '6999043000003162333', ssot: 'SSOT-131', dataSha256: '5d3e4e6434aa201ee99b577e84e7fb2b754cfad51011f7f81bb7c05b96036af7', ps: 'completed', ss: 'synced' },
  { id: 253, oldZohoId: '6999043000001967018', newZohoId: '6999043000003162332', ssot: 'SSOT-165', dataSha256: '4e9a00df305565c72e8c6d9df7f0bb56b25194520df228f8059d411b88b50fbe', ps: 'completed', ss: 'synced' },
  { id: 259, oldZohoId: '6999043000002306007', newZohoId: '6999043000003162315', ssot: 'SSOT-261', dataSha256: '9baa9ca78fdae73c1fffca876c8916f0512dfd37b4fb08682ae5750434f5a902', ps: 'completed', ss: 'synced' },
  { id: 261, oldZohoId: '6999043000002294012', newZohoId: '6999043000003162306', ssot: 'SSOT-211', dataSha256: 'f556f9f7901cae47c8d90ffd0556c8b107bedade98b3f2e0cd2fd655f4f17142', ps: 'completed', ss: 'synced' },
  { id: 263, oldZohoId: '6999043000002307017', newZohoId: '6999043000003162305', ssot: 'SSOT-231', dataSha256: 'b6086c7d21003da31748cd599b9c6ed47a2bf6224a94007861f23268c6e0f514', ps: 'completed', ss: 'synced' },
  { id: 265, oldZohoId: '6999043000002308016', newZohoId: '6999043000003162308', ssot: 'SSOT-129', dataSha256: 'dd127749e76abdb0cc32894247b3051e7b83032d480e757ebd2cf12bb9e4a5cc', ps: 'completed', ss: 'synced' },
  { id: 267, oldZohoId: '6999043000002301008', newZohoId: '6999043000003162309', ssot: 'SSOT-147', dataSha256: '8989cf86b0e7a19f020296a70e74abaec16c4a354e853dd1b0f36d1ecd8c9a49', ps: 'completed', ss: 'synced' },
  { id: 268, oldZohoId: '6999043000002308014', newZohoId: '6999043000003162311', ssot: 'SSOT-148', dataSha256: '9479e0dba51a2555a9e9a7c402e3e2cada0eacbfbd33aaeab2b9280e70bb2241', ps: 'completed', ss: 'synced' },
  { id: 269, oldZohoId: '6999043000002300022', newZohoId: '6999043000003162310', ssot: 'SSOT-130', dataSha256: 'dccf246f9456543153318a77cf57d1589a61d0327da91907f9924f0e5ef0c686', ps: 'completed', ss: 'synced' },
  { id: 271, oldZohoId: '6999043000002303013', newZohoId: '6999043000003162313', ssot: 'SSOT-197', dataSha256: '837484cffc2eada227eb5a97641259f61f4b47230a1e309bae5f5055c6791789', ps: 'completed', ss: 'synced' },
  { id: 272, oldZohoId: '6999043000002313017', newZohoId: '6999043000003162314', ssot: 'SSOT-201', dataSha256: 'ef48568cd7db841792df591e5a43f606a96328d5819843363bbe2e7bd529b389', ps: 'completed', ss: 'synced' },
  { id: 279, oldZohoId: '6999043000002305023', newZohoId: '6999043000003162312', ssot: 'SSOT-191', dataSha256: '8315b3c193dc2a0da3bccb5bb4e934766f17b7a928f939aad48d71a39489ca03', ps: 'failed', ss: 'failed' },
  { id: 280, oldZohoId: '6999043000002307023', newZohoId: '6999043000003162311', ssot: 'SSOT-148', dataSha256: '9479e0dba51a2555a9e9a7c402e3e2cada0eacbfbd33aaeab2b9280e70bb2241', ps: 'failed', ss: 'failed' },
  { id: 281, oldZohoId: '6999043000002305021', newZohoId: '6999043000003162310', ssot: 'SSOT-130', dataSha256: 'dccf246f9456543153318a77cf57d1589a61d0327da91907f9924f0e5ef0c686', ps: 'failed', ss: 'failed' },
  { id: 282, oldZohoId: '6999043000002297008', newZohoId: '6999043000003162309', ssot: 'SSOT-147', dataSha256: '8989cf86b0e7a19f020296a70e74abaec16c4a354e853dd1b0f36d1ecd8c9a49', ps: 'failed', ss: 'failed' },
  { id: 283, oldZohoId: '6999043000002298013', newZohoId: '6999043000003162308', ssot: 'SSOT-129', dataSha256: 'dd127749e76abdb0cc32894247b3051e7b83032d480e757ebd2cf12bb9e4a5cc', ps: 'failed', ss: 'failed' },
  { id: 284, oldZohoId: '6999043000002303017', newZohoId: '6999043000003162307', ssot: 'SSOT-167', dataSha256: '1995db0c01fd918b293428f10a525d4f98b1bf1a0485f2a8ecf32dd6d2d99e82', ps: 'failed', ss: 'failed' },
  { id: 285, oldZohoId: '6999043000002296017', newZohoId: '6999043000003162306', ssot: 'SSOT-211', dataSha256: 'f556f9f7901cae47c8d90ffd0556c8b107bedade98b3f2e0cd2fd655f4f17142', ps: 'failed', ss: 'failed' },
  { id: 350, oldZohoId: '6999043000002732001', newZohoId: '6999043000003162263', ssot: 'SSOT-159', dataSha256: '3130fc56afbf337a90297894af04803a4bde6d8c8901197f3cbfb62a4dd1bce5', ps: 'completed', ss: 'synced' },
  { id: 351, oldZohoId: '6999043000002745001', newZohoId: '6999043000003162264', ssot: 'SSOT-213', dataSha256: 'e77d1032cce1af1cfce9b90f7c30feb8e490702708c2659ddced920172048449', ps: 'completed', ss: 'synced' },
  { id: 352, oldZohoId: '6999043000002752001', newZohoId: '6999043000003162265', ssot: 'SSOT-126', dataSha256: '674a2591e49288323c9fcffdd105d8683cf902a362343d0906366176db830036', ps: 'completed', ss: 'synced' },
  { id: 361, oldZohoId: '6999043000002793001', newZohoId: '6999043000003162266', ssot: 'SSOT-237', dataSha256: '584582153cb0b28f7bd8015457bd3a147aa4dc646a600a00f13763d773113d09', ps: 'completed', ss: 'synced' },
  { id: 362, oldZohoId: '6999043000002824001', newZohoId: '6999043000003162267', ssot: 'SSOT-235', dataSha256: '361ed4e2726cede27d42c72568d0efd56d8df1a9f69166a2839132ec38bd3112', ps: 'completed', ss: 'synced' },
  { id: 367, oldZohoId: '6999043000002937001', newZohoId: '6999043000003162297', ssot: 'SSOT-193', dataSha256: '8c1b57841b68fd865a05290a0a332e04288c54272b4e8de005031c7e8edb03ac', ps: 'completed', ss: 'synced' },
  { id: 368, oldZohoId: '6999043000002940001', newZohoId: '6999043000003162298', ssot: 'SSOT-127', dataSha256: '6e2b4b6d7f14397e5934eb8949a4319669751e9be59a8c34f06eef322e09ede6', ps: 'completed', ss: 'synced' },
  { id: 369, oldZohoId: '6999043000002917256', newZohoId: '6999043000003162266', ssot: 'SSOT-237', dataSha256: '7c540bde501408398267046a7242a30b479a801fe2d0402cf1d6c11339299a4d', ps: 'completed', ss: 'synced' }
];
/** CRM records merged away on 23 Nov 2026 — no submission may point at these. */
export const MERGED_AWAY_IDS: string[] = [
  '6999043000003162095',
  '6999043000003162106',
  '6999043000003162125',
  '6999043000003162127',
  '6999043000003162134',
  '6999043000003162136',
  '6999043000003162139',
  '6999043000003162202',
  '6999043000003162204',
  '6999043000003162228',
  '6999043000003162232',
  '6999043000003162241',
  '6999043000003162268',
  '6999043000003162269',
  '6999043000003162271',
  '6999043000003162273',
  '6999043000003162276',
  '6999043000003162282',
  '6999043000003162285',
  '6999043000003162286',
  '6999043000003162287',
  '6999043000003162292',
  '6999043000003162294',
  '6999043000003162301',
  '6999043000003162302',
  '6999043000003162303',
  '6999043000003162304',
  '6999043000003162318',
  '6999043000003162319',
  '6999043000003162320',
  '6999043000003162321',
  '6999043000003162322',
  '6999043000003162323',
  '6999043000003162324',
  '6999043000003162325',
  '6999043000003162326',
  '6999043000003162327',
  '6999043000003162328',
  '6999043000003162329',
  '6999043000003162330',
  '6999043000003162331',
  '6999043000003467057'
];
/** Duplicates whose merge was held — links to these are valid and are left alone. */
export const HELD_DUPLICATE_IDS: string[] = ['6999043000003162058', '6999043000003162120', '6999043000003162137', '6999043000003162278', '6999043000003162342'];
const MAX_ID_IN_20NOV_DUMP = 401;

const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

export function opsAuth(now: () => Date = () => new Date()) {
  return (req: Request, res: Response, next: NextFunction) => {
    const tok = req.get("x-ops-token") || "";
    const ok = now() < OPS_EXPIRES_AT && tok.length > 0 && /^[0-9a-f]{64}$/i.test(OPS_TOKEN_SHA256) &&
      crypto.timingSafeEqual(Buffer.from(sha256(tok), "hex"), Buffer.from(OPS_TOKEN_SHA256, "hex"));
    console.log(`[OPS v026] ${req.method} ${req.path} auth=${ok ? "ok" : "denied"} ip=${req.ip} xff=${req.get("x-forwarded-for") || ""}`);
    if (!ok) return next("route");
    next();
  };
}

type Check = { id: number; ssot: string; found: boolean; zohoCrmId: string | null; status: string; fingerprintMatches: boolean;
               state: "OLD" | "NEW" | "UNEXPECTED"; problems: string[] };

async function inspect(client: any, rows: RelinkRow[], forUpdate: boolean): Promise<Check[]> {
  const r = await client.query(
    `SELECT id, zoho_crm_id, processing_status::text AS ps, sync_status::text AS ss,
            lower(trim(submission_data->>'email')) AS email, submission_data::text AS data
       FROM public.form_submissions WHERE id = ANY($1::int[]) ORDER BY id ${forUpdate ? "FOR UPDATE" : ""}`,
    [rows.map((x) => x.id)]);
  const byId = new Map<number, any>(r.rows.map((x: any) => [Number(x.id), x]));
  return rows.map((exp) => {
    const row = byId.get(exp.id);
    const problems: string[] = [];
    if (!row) return { id: exp.id, ssot: exp.ssot, found: false, zohoCrmId: null, status: "", fingerprintMatches: false, state: "UNEXPECTED", problems: ["row not found"] };
    const fingerprintMatches = exp.dataSha256 ? sha256(row.data || "") === exp.dataSha256
                                              : !!row.email && sha256(row.email) === exp.emailSha256;
    if (!fingerprintMatches) problems.push(exp.dataSha256 ? "submission data differs from the 20 Nov backup" : "email does not match expected person");
    if (row.ps !== exp.ps || row.ss !== exp.ss) problems.push(`status ${row.ps}/${row.ss} (expected ${exp.ps}/${exp.ss})`);
    const state = row.zoho_crm_id === exp.oldZohoId ? "OLD" : row.zoho_crm_id === exp.newZohoId ? "NEW" : "UNEXPECTED";
    if (state === "UNEXPECTED") problems.push(`zoho_crm_id ${row.zoho_crm_id} is neither the old (${exp.oldZohoId}) nor the new (${exp.newZohoId}) id`);
    return { id: exp.id, ssot: exp.ssot, found: true, zohoCrmId: row.zoho_crm_id, status: `${row.ps}/${row.ss}`, fingerprintMatches, state, problems };
  });
}

async function change(rows: RelinkRow[], direction: "relink" | "rollback", apply: boolean): Promise<any> {
  let client: any;
  try { client = await pool.connect(); }
  catch (e: any) { return { ok: false, applied: false, reason: `database connection failed, nothing changed: ${e?.message || e}` }; }
  let result: any;
  try {
    await client.query("BEGIN");
    const checks = await inspect(client, rows, true);
    const want = direction === "relink" ? "OLD" : "NEW";
    const blocked = checks.filter((c) => c.problems.length > 0 || c.state !== want);
    if (blocked.length > 0) {
      await client.query("ROLLBACK");
      return { ok: false, applied: false, reason: `every row must be in state ${want} with no problems; nothing changed`, blocked, checkedRows: checks.length };
    }
    const changes = [];
    for (const exp of rows) {
      const [from, to] = direction === "relink" ? [exp.oldZohoId, exp.newZohoId] : [exp.newZohoId, exp.oldZohoId];
      const u = await client.query(
        `UPDATE public.form_submissions SET zoho_crm_id = $1
          WHERE id = $2 AND zoho_crm_id = $3 AND processing_status::text = $4 AND sync_status::text = $5`,
        [to, exp.id, from, exp.ps, exp.ss]);
      if (u.rowCount !== 1) throw new Error(`row ${exp.id}: ${u.rowCount} rows updated, expected 1`);
      changes.push({ id: exp.id, ssot: exp.ssot, from, to });
    }
    if (apply) await client.query("COMMIT"); else await client.query("ROLLBACK");
    result = { ok: true, applied: apply, dryRun: !apply, count: changes.length, changes };
  } catch (e: any) {
    await client.query("ROLLBACK").catch(() => {});
    return { ok: false, applied: false,
             reason: `not applied (or outcome unknown if the error hit during COMMIT) - check the verify endpoint: ${e?.message || e}` };
  } finally {
    client.release();
  }
  if (apply) {
    try { const after = await inspect(pool, rows, false); result.allNew = after.every((c) => c.state === "NEW" && c.problems.length === 0); }
    catch (e: any) { result.afterError = `committed; post-check read failed (${e?.message || e}) - check the verify endpoint`; }
  }
  return result;
}

function registerSet(app: Express, auth: any, base: string, rows: RelinkRow[], label: string) {
  const n = rows.length;
  app.get(`${base}/verify`, auth, async (_req, res) => {
    try {
      const checks = await inspect(pool, rows, false);
      const notNew = checks.filter((c) => !(c.state === "NEW" && c.problems.length === 0));
      res.json({ allRelinked: notNew.length === 0, rows: n, notRelinked: notNew });
    } catch (e: any) { res.status(500).json({ error: e?.message || String(e) }); }
  });
  app.post(`${base}/relink`, auth, async (req, res) => {
    try {
      const result = await change(rows, "relink", req.body?.confirm === `RELINK-${n}`);
      console.log(`[OPS v026] ${label} relink ok=${result.ok} applied=${result.applied}`);
      res.status(result.ok ? 200 : 409).json(result);
    } catch (e: any) { res.status(500).json({ error: e?.message || String(e) }); }
  });
  app.post(`${base}/rollback`, auth, async (req, res) => {
    try {
      const result = await change(rows, "rollback", req.body?.confirm === `ROLLBACK-${n}`);
      console.log(`[OPS v026] ${label} rollback ok=${result.ok} applied=${result.applied}`);
      res.status(result.ok ? 200 : 409).json(result);
    } catch (e: any) { res.status(500).json({ error: e?.message || String(e) }); }
  });
}

export function registerOpsV026Routes(app: Express, now?: () => Date) {
  const auth = opsAuth(now);

  // READ-ONLY overview: both sets, links to merged-away records (must be none), registrations since 20 Nov.
  app.get("/api/ops/v026/db/precheck", auth, async (_req, res) => {
    try {
      const checks = await inspect(pool, RELINK_ROWS, false);
      const fullChecks = await inspect(pool, FULL_RELINK_ROWS, false);
      const merged = await pool.query(
        `SELECT id, zoho_crm_id FROM public.form_submissions WHERE zoho_crm_id = ANY($1::text[]) ORDER BY id`, [MERGED_AWAY_IDS]);
      const held = await pool.query(
        `SELECT id, zoho_crm_id FROM public.form_submissions WHERE zoho_crm_id = ANY($1::text[]) ORDER BY id`, [HELD_DUPLICATE_IDS]);
      const recent = await pool.query(
        `SELECT id, created_at, processing_status::text AS processing_status, sync_status::text AS sync_status, zoho_crm_id
           FROM public.form_submissions WHERE id > $1 ORDER BY id`, [MAX_ID_IN_20NOV_DUMP]);
      const total = await pool.query(`SELECT count(*)::int AS n, max(id)::int AS max_id FROM public.form_submissions`);
      const tally = (cs: Check[]) => cs.reduce((a: any, c) => { const k = c.problems.length ? "PROBLEM" : c.state; a[k] = (a[k] || 0) + 1; return a; }, {});
      res.json({
        readyToRelink: checks.every((c) => c.state === "OLD" && c.problems.length === 0) && merged.rows.length === 0,
        rows: checks,
        full: { readyToRelink: fullChecks.every((c) => c.state === "OLD" && c.problems.length === 0) && merged.rows.length === 0,
                rows: fullChecks.length, states: tally(fullChecks), problems: fullChecks.filter((c) => c.problems.length > 0) },
        linksToMergedAway: merged.rows, linksToHeldDuplicates: held.rows,
        rowsSince20NovDump: recent.rows, totals: total.rows[0],
      });
    } catch (e: any) { res.status(500).json({ error: e?.message || String(e) }); }
  });

  // set "six" (unchanged paths): /api/ops/v026/db/{relink|verify|rollback}  confirm RELINK-6 / ROLLBACK-6
  registerSet(app, auth, "/api/ops/v026/db", RELINK_ROWS, "six");
  // set "full": /api/ops/v026/db/full/{relink|verify|rollback}  confirm RELINK-186 / ROLLBACK-186
  registerSet(app, auth, "/api/ops/v026/db/full", FULL_RELINK_ROWS, "full");
}
