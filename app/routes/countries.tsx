import { useNavigate } from "@remix-run/react";
import { Outlet, useParams } from "@remix-run/react";
import { capitalize } from "lodash";
import { regions } from "~/util/regions";

export default () => {
  const { region: regionParam } = useParams<{ region: string }>();
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <select
          name="country"
          id="region"
          onChange={(e) => navigate(e.target.value)}
          defaultValue={regionParam ?? "_"}
        >
          <option value="_" disabled>
            Select a region
          </option>
          {regionParam && <option value="">World</option>}
          {regions.map((region) => (
            <option key={region} value={region}>
              {capitalize(region)}
            </option>
          ))}
        </select>
      </div>
      <Outlet />
    </div>
  );
};
