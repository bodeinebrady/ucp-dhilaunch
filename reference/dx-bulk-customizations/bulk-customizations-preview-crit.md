---
marp: true
theme: docker-light
paginate: true
html: true
---

<!-- Build: npx @marp-team/marp-cli bulk-customizations-preview-crit.md --pdf --allow-local-files --theme-set ~/loupe/themes/ -->

<!-- _class: accent -->
<!-- _paginate: false -->

# Build Preview

Seeing what your customization does before it does it

<!--
DXT-642. The bulk customization wizard lets you compose a hardened image from a base image, packages, OCI artifacts, and settings. The preview step shows the resolved configuration before committing to a build. This is a design crit for the preview feature specifically.
-->

---

<!-- _class: centered -->

## Bell Canada added a Java OCI artifact<br>to a Python customization

Java's env vars silently merged into the final image.<br>Nobody told them this would happen.

<!--
Mathieu Benoit raised it in Slack. The merge rules are actually correct: customization values win over artifact values for ordinary keys. But the user has zero visibility into what got merged, what got overridden, and what got inherited. The preview exists to make the resolution visible before the user commits to a 20-30s build. Andre Silva proposed a dry run on the backend paired with a preview on the frontend. Brian Rubinton created DXT-642.
-->

---

<!-- _class: split -->

## Two paths from Review

<div>

### Skip preview

"Build customization" commits directly.
For repeat configs or simple setups.

</div>
<div>

### See it first

"Preview build" advances to step 5.
For first-time configs, complex artifacts, or upstream changes.

</div>

<!--
Preview is opt-in, not blocking. The Review step offers both buttons: outline "Build customization" (skip), primary "Preview build" (see it). The primary nudges toward preview without gating experienced users. Preview is a separate wizard step because it takes 20-30s. Embedding it in Review would create a confusing mixed state.
-->

---

<style scoped>
.tiers { display: flex; flex-direction: column; gap: 14px; margin-top: 20px; }
.tier { display: flex; align-items: center; gap: 16px; padding: 14px 20px; border-radius: 8px; background: var(--dds-bg-elevated); border: 1px solid var(--dds-border); }
.tier-label { font-size: 15px; color: var(--dds-fg); min-width: 180px; font-weight: 520; }
.tier-desc { font-size: 14px; color: var(--dds-fg-muted); flex: 1; }
.tier-viz { font-size: 13px; padding: 4px 10px; border-radius: 4px; white-space: nowrap; }
.plain { color: var(--dds-fg-muted); }
.badge-blue { background: rgba(29,99,237,0.1); color: var(--dds-primary); }
.badge-amber { background: rgba(184,85,4,0.1); color: var(--dds-warning); }
</style>

## Origin labels match importance

<div class="tiers">
<div class="tier">
<div class="tier-label">Customization</div>
<div class="tier-desc">User set this value explicitly</div>
<div class="tier-viz plain">Plain text</div>
</div>
<div class="tier">
<div class="tier-label">Tag definition</div>
<div class="tier-desc">Set by the image maintainer</div>
<div class="tier-viz plain">Plain text</div>
</div>
<div class="tier">
<div class="tier-label">Inherited from artifact</div>
<div class="tier-desc">User should be aware this exists</div>
<div class="tier-viz badge-blue">Blue badge</div>
</div>
<div class="tier">
<div class="tier-label">Override</div>
<div class="tier-desc">Artifact value was suppressed</div>
<div class="tier-viz badge-amber">Amber badge</div>
</div>
</div>

Expected origins recede. Surprising origins pop.

<!--
The alternative was to badge everything equally. That creates the "everything is highlighted so nothing is" problem. Plain text for expected origins, colored badges only for Override, OCI artifact, and PATH merged. The interesting rows draw the eye, the baseline rows stay quiet.
-->

---

<!-- _class: split -->

## Modified vs. unmodified

<div>

### Modified sections

Open by default. Fields the customization changed.

Summary: *6 set, 4 overrides, 9 inherited*

</div>
<div>

### Unmodified sections

Collapsed with count badge. Fields the user didn't touch, but that exist in the resolved image.

Not hidden, just quiet.

</div>

<!--
A Python 3.13 customization with 3 OCI artifacts produces 35+ env vars, 16 labels, 9 annotations. Showing everything flat is a wall of text. The modified/unmodified split puts the user's changes first and lets them drill into inherited values on demand.
-->

---

<!-- _class: dark-accent -->
<!-- _paginate: false -->

# The ask

Should the preview organize by field type, or by surprise level?
Is the list scannable?
Should it lead with a summary before showing the full list?

<!--
(1) Current organization is by field type (env vars, CMD, labels). Alternative: organize by risk. Warnings first (overrides, PATH merges), then inherited values the user didn't ask for, then confirmed values. Terraform plan and CloudFormation change sets both organize by "what changed" not "what type of thing is it." (2) Scanability: with 35+ env vars, 16 labels, and 9 annotations, the list is long. Do we need better filtering, grouping by artifact source, or visual compression? (3) Terraform plan ends with "2 to add, 1 to change, 0 to destroy." The current preview goes straight to the full list. A summary line like "4 overrides, 8 inherited, 0 conflicts" might be all the user needs before deciding whether to drill in.
-->
