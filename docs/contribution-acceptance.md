# Record contributor permission with GitHub

The [Contributor License Agreement v1.0](../CONTRIBUTOR-LICENSE.md) gives Codriver separate commercial and sublicensing permission without individual attribution in its products. Public releases remain MIT code/docs and CC BY models. A public license or an ordinary DCO sign-off alone is not this separate permission.

## Contributor: expressly accept for the submitted work

1. Read the agreement. On GitHub, open the agreement file at the version you accept and press **Y** (or use “Copy permalink”) to obtain an immutable commit URL.
2. After your contribution is ready, post the following declaration as a comment from your own GitHub account. Fill in the PR URL, full commit SHA and agreement permalink; do not leave placeholders.
3. Each rights holder or authorized representative must accept for their work. If an employer owns it, identify that organization and your authority. Do not post home addresses, private employment records or other unnecessary personal data. Your public library credit can be a pseudonym or GitHub handle.

```text
I have read and agree to the Codriver Contributor License Agreement v1.0:
Agreement permalink: [immutable GitHub URL]

I grant the rights in that agreement for my original contributions in:
Pull request: [URL]
Covered commit: [full SHA]
Rights holder: [individual or organization]
Signing in my capacity as: [rights holder / authorized representative of ...]
Third-party components and co-authors: [list and license references, or none]

I understand that Codriver may use, modify, distribute and sublicense this work
commercially without individual attribution in its products, and that contributor
recognition is provided in the public 3D asset library.

I intend this declaration and my typed signature as my acceptance of the agreement.
Signature: [signatory name]
GitHub account: [handle]
Date: [YYYY-MM-DD]
Requested library credit: [name, handle or anonymous]
```

Do not let a bot or AI assistant sign on your behalf. A maintainer cannot infer your acceptance from the PR template or author it for you. If material contributions or rights holders change after signing, post an updated declaration identifying the new covered commit. Preserve the earlier record.

## Maintainer: verify before accepting outside work

- Confirm the declaration comes from each contributor or a representative with authority over the identified work. Review co-authors, commit history and third-party components; the PR opener may not own everything in a PR. Resolve uncertain authority before merging.
- Check that the immutable agreement URL, version, contribution scope and covered commit match the work being accepted. Keep the declaration’s comment permalink with the asset’s provenance notes; for code/docs-only changes, the PR record is the reference.
- Preserve the rights holder’s copyright in metadata. The agreement is a license, not an assignment. Keep the requested library credit and all independent third-party/data notices.
- Check each third-party component’s terms separately. An accepted CLA cannot remove someone else’s MIT/CC BY/ODbL obligations. Product integration may rely on Codriver ownership or a verified separate grant for the original contribution; missing permission is not an attribution exemption.
- Before merging, check the maintainer review item in the PR template. For wholly Codriver-owned changes, record that ownership basis instead of inventing a contributor signature. Never grant the product permission retroactively by changing a catalog copyright field.

GitHub stores the explicit declaration and review history. The repository’s automated checks validate files and models; **they do not authenticate a signatory, determine ownership or enforce CLA acceptance**. This is a manual merge requirement, not a claim that CI proves legal permission.

This is a project-specific agreement and acceptance process, not a jurisdiction-independent guarantee of enforceability. Codriver should have qualified counsel review the terms, electronic acceptance and any required language/local formalities before relying on them for outside contributions.
